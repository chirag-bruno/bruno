import React, { useEffect, useMemo } from 'react';
import each from 'lodash/each';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { findCollectionByUid, flattenItems, isItemARequest, hasRequestChanges, findEnvironmentInCollection } from 'utils/collections';
import { pluralizeWord } from 'utils/common';
import { completeQuitFlow } from 'providers/ReduxStore/slices/app';
import { saveMultipleRequests, saveMultipleCollections, saveMultipleFolders, saveEnvironment, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import { saveGlobalEnvironment } from 'providers/ReduxStore/slices/global-environments';
import { IconAlertTriangle, IconDeviceFloppy } from '@tabler/icons';
import Modal from 'components/Modal';
import Button from 'ui/Button';
import StyledWrapper from './StyledWrapper';

const SaveRequestsModal = ({ onClose }) => {
  const MAX_UNSAVED_ITEMS_TO_SHOW = 5;
  const collections = useSelector((state) => state.collections.collections);
  const tabs = useSelector((state) => state.tabs.tabs);
  const globalEnvironments = useSelector((state) => state.globalEnvironments.globalEnvironments);
  const globalEnvironmentDraft = useSelector((state) => state.globalEnvironments.globalEnvironmentDraft);
  const tempDirectories = useSelector((state) => state.collections.tempDirectories);
  const dispatch = useDispatch();

  const { regularDrafts, transientDrafts } = useMemo(() => {
    const requestDrafts = [];
    const transientRequestDrafts = [];
    const collectionDrafts = [];
    const folderDrafts = [];
    const environmentDrafts = [];
    const tabsByCollection = groupBy(tabs, (t) => t.collectionUid);

    Object.keys(tabsByCollection).forEach((collectionUid) => {
      const collection = findCollectionByUid(collections, collectionUid);
      if (collection) {
        // Check for collection draft
        if (collection.draft) {
          collectionDrafts.push({
            type: 'collection',
            name: collection.name,
            collectionUid: collectionUid
          });
        }

        // Check for collection environment draft
        if (collection.environmentsDraft) {
          const { environmentUid, variables } = collection.environmentsDraft;
          const environment = findEnvironmentInCollection(collection, environmentUid);
          if (environment && variables) {
            environmentDrafts.push({
              type: 'collection-environment',
              name: environment.name,
              environmentUid,
              variables,
              collectionUid: collectionUid
            });
          }
        }

        // Check for request and folder drafts
        const items = flattenItems(collection.items);
        const tempDirectory = tempDirectories?.[collectionUid];

        // Request drafts - separate transient from regular
        const requests = filter(items, (item) => isItemARequest(item) && hasRequestChanges(item));
        each(requests, (draft) => {
          const isTransient = tempDirectory && draft.pathname?.startsWith(tempDirectory);
          if (isTransient) {
            transientRequestDrafts.push({
              type: 'transient-request',
              ...draft,
              collectionUid: collectionUid,
              collectionName: collection.name
            });
          } else {
            requestDrafts.push({
              type: 'request',
              ...draft,
              collectionUid: collectionUid
            });
          }
        });

        // Folder drafts
        const folders = filter(items, (item) => item.type === 'folder' && item.draft);
        each(folders, (folder) => {
          folderDrafts.push({
            type: 'folder',
            name: folder.name,
            folderUid: folder.uid,
            collectionUid: collectionUid
          });
        });
      }
    });

    // Check for global environment draft
    if (globalEnvironmentDraft) {
      const { environmentUid, variables } = globalEnvironmentDraft;
      const environment = globalEnvironments?.find((env) => env.uid === environmentUid);
      if (environment && variables) {
        environmentDrafts.push({
          type: 'global-environment',
          name: environment.name,
          environmentUid,
          variables
        });
      }
    }

    return {
      regularDrafts: [...collectionDrafts, ...folderDrafts, ...environmentDrafts, ...requestDrafts],
      transientDrafts: transientRequestDrafts
    };
  }, [collections, tabs, globalEnvironments, globalEnvironmentDraft, tempDirectories]);

  const totalDraftsCount = regularDrafts.length + transientDrafts.length;

  useEffect(() => {
    if (totalDraftsCount === 0) {
      return dispatch(completeQuitFlow());
    }
  }, [totalDraftsCount, dispatch]);

  const closeWithoutSave = () => {
    dispatch(completeQuitFlow());
    onClose();
  };

  const closeWithSave = async () => {
    try {
      // Separate drafts by type (using regularDrafts - transient requests must be saved individually)
      const collectionDrafts = regularDrafts.filter((d) => d.type === 'collection');
      const folderDrafts = regularDrafts.filter((d) => d.type === 'folder');
      const requestDrafts = regularDrafts.filter((d) => d.type === 'request');
      const collectionEnvironmentDrafts = regularDrafts.filter((d) => d.type === 'collection-environment');
      const globalEnvironmentDrafts = regularDrafts.filter((d) => d.type === 'global-environment');

      // Save all collection drafts
      if (collectionDrafts.length > 0) {
        await dispatch(saveMultipleCollections(collectionDrafts));
      }

      // Save all folder drafts
      if (folderDrafts.length > 0) {
        await dispatch(saveMultipleFolders(folderDrafts));
      }

      // Save all request drafts
      if (requestDrafts.length > 0) {
        await dispatch(saveMultipleRequests(requestDrafts));
      }

      // Save all collection environment drafts
      for (const draft of collectionEnvironmentDrafts) {
        await dispatch(saveEnvironment(draft.variables, draft.environmentUid, draft.collectionUid));
      }

      // Save all global environment drafts
      for (const draft of globalEnvironmentDrafts) {
        await dispatch(saveGlobalEnvironment({ variables: draft.variables, environmentUid: draft.environmentUid }));
      }

      dispatch(completeQuitFlow());
      onClose();
    } catch (error) {
      console.error('Error saving drafts:', error);
    }
  };

  const handleSaveTransient = (draft) => {
    dispatch(saveRequest(draft.uid, draft.collectionUid));
  };

  if (totalDraftsCount === 0) {
    return null;
  }

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title="Unsaved changes"
        confirmText="Save and Close"
        cancelText="Close without saving"
        handleCancel={onClose}
        disableEscapeKey={true}
        disableCloseOnOutsideClick={true}
        closeModalFadeTimeout={150}
        hideFooter={true}
      >
        <div className="flex items-center">
          <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
          <h1 className="ml-2 text-lg font-medium">Hold on..</h1>
        </div>
        <p className="mt-4">
          Do you want to save the changes you made to the following{' '}
          <span className="font-medium">{totalDraftsCount}</span> {pluralizeWord('item', totalDraftsCount)}?
        </p>

        {/* Regular drafts (saved items with changes) */}
        {regularDrafts.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Saved {pluralizeWord('Item', regularDrafts.length)} ({regularDrafts.length})
            </p>
            <ul className="ml-2">
              {regularDrafts.slice(0, MAX_UNSAVED_ITEMS_TO_SHOW).map((item, index) => {
                let prefix;
                switch (item.type) {
                  case 'collection':
                    prefix = 'Collection: ';
                    break;
                  case 'folder':
                    prefix = 'Folder: ';
                    break;
                  case 'collection-environment':
                    prefix = 'Collection Environment: ';
                    break;
                  case 'global-environment':
                    prefix = 'Global Environment: ';
                    break;
                  default:
                    prefix = 'Request: ';
                }
                return (
                  <li key={`${item.type}-${item.collectionUid || item.uid}-${index}`} className="mt-1 text-xs draft-list-item">
                    {prefix}
                    {item.name || item.filename}
                  </li>
                );
              })}
            </ul>
            {regularDrafts.length > MAX_UNSAVED_ITEMS_TO_SHOW && (
              <p className="ml-2 mt-1 text-xs draft-list-muted">
                ...{regularDrafts.length - MAX_UNSAVED_ITEMS_TO_SHOW} additional{' '}
                {pluralizeWord('item', regularDrafts.length - MAX_UNSAVED_ITEMS_TO_SHOW)} not shown
              </p>
            )}
          </div>
        )}

        {/* Transient (unsaved) requests */}
        {transientDrafts.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Transient {pluralizeWord('Request', transientDrafts.length)} ({transientDrafts.length})
            </p>
            <p className="text-xs text-orange-600 mb-3">
              These requests need to be saved individually before closing the application.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {transientDrafts.map((item) => {
                return (
                  <div
                    key={item.uid}
                    className="transient-request-card"
                  >
                    <div className="flex flex-col flex-1 min-w-0 mr-3">
                      <span className="transient-request-name">{item.name}</span>
                      <span className="transient-request-collection">
                        {item.collectionName}
                      </span>
                    </div>
                    <Button
                      color="primary"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveTransient(item)}
                      icon={<IconDeviceFloppy size={14} strokeWidth={1.5} />}
                    >
                      Save
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>
            <Button color="danger" onClick={closeWithoutSave}>
              Don't Save
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" color="secondary" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={closeWithSave}
              disabled={transientDrafts.length > 0}
              title={transientDrafts.length > 0 ? 'Please save or discard transient requests first' : ''}
            >
              {regularDrafts.length > 1 ? 'Save All' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default SaveRequestsModal;
