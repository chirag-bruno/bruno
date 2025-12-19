import React, { useEffect, useMemo, useState } from 'react';
import each from 'lodash/each';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { findCollectionByUid, flattenItems, isItemARequest, hasRequestChanges, isScratchpadCollection } from 'utils/collections';
import { pluralizeWord } from 'utils/common';
import { completeQuitFlow } from 'providers/ReduxStore/slices/app';
import { saveMultipleRequests, saveMultipleCollections, saveMultipleFolders, saveScratchpadRequestsToCollection } from 'providers/ReduxStore/slices/collections/actions';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import SelectCollection from 'components/Sidebar/Collections/SelectCollection';

const SaveRequestsModal = ({ onClose }) => {
  const MAX_UNSAVED_ITEMS_TO_SHOW = 5;
  const collections = useSelector((state) => state.collections.collections);
  const tabs = useSelector((state) => state.tabs.tabs);
  const dispatch = useDispatch();
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [pendingScratchpadRequests, setPendingScratchpadRequests] = useState([]);

  const allDrafts = useMemo(() => {
    const requestDrafts = [];
    const collectionDrafts = [];
    const folderDrafts = [];
    const scratchpadRequestDrafts = [];
    const tabsByCollection = groupBy(tabs, (t) => t.collectionUid);

    Object.keys(tabsByCollection).forEach((collectionUid) => {
      const collection = findCollectionByUid(collections, collectionUid);
      if (collection) {
        const isScratchpad = isScratchpadCollection(collection);

        // Check for collection draft (skip for scratchpad)
        if (!isScratchpad && collection.draft) {
          collectionDrafts.push({
            type: 'collection',
            name: collection.name,
            collectionUid: collectionUid
          });
        }

        // Check for request and folder drafts
        const items = flattenItems(collection.items);

        // Request drafts
        const requests = filter(items, (item) => isItemARequest(item) && hasRequestChanges(item));
        each(requests, (draft) => {
          if (isScratchpad) {
            scratchpadRequestDrafts.push({
              type: 'scratchpad-request',
              ...draft,
              collectionUid: collectionUid
            });
          } else {
            requestDrafts.push({
              type: 'request',
              ...draft,
              collectionUid: collectionUid
            });
          }
        });

        // Folder drafts (skip for scratchpad)
        if (!isScratchpad) {
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
      }
    });

    return [...collectionDrafts, ...folderDrafts, ...requestDrafts, ...scratchpadRequestDrafts];
  }, [collections, tabs]);

  const regularDrafts = allDrafts.filter((d) => d.type !== 'scratchpad-request');
  const scratchpadDrafts = allDrafts.filter((d) => d.type === 'scratchpad-request');
  const totalDraftsCount = allDrafts.length;

  useEffect(() => {
    if (totalDraftsCount === 0) {
      return dispatch(completeQuitFlow());
    }
  }, [totalDraftsCount, dispatch]);

  const closeWithoutSave = () => {
    dispatch(completeQuitFlow());
    onClose();
  };

  const handleSaveScratchpadRequests = () => {
    const scratchpadRequests = allDrafts.filter((d) => d.type === 'scratchpad-request');
    if (scratchpadRequests.length > 0) {
      setPendingScratchpadRequests(scratchpadRequests.map((r) => r.uid));
      setShowCollectionPicker(true);
    }
  };

  const handleCollectionSelected = async (targetCollectionUid) => {
    try {
      await dispatch(saveScratchpadRequestsToCollection(pendingScratchpadRequests, targetCollectionUid));
      setShowCollectionPicker(false);
      setPendingScratchpadRequests([]);

      // Check if there are any remaining drafts
      const remainingDrafts = allDrafts.filter((d) => d.type !== 'scratchpad-request' || !pendingScratchpadRequests.includes(d.uid));
      if (remainingDrafts.length === 0) {
        dispatch(completeQuitFlow());
        onClose();
      }
    } catch (error) {
      console.error('Error saving scratchpad requests:', error);
    }
  };

  const closeWithSave = async () => {
    try {
      // Separate drafts by type
      const collectionDrafts = allDrafts.filter((d) => d.type === 'collection');
      const folderDrafts = allDrafts.filter((d) => d.type === 'folder');
      const requestDrafts = allDrafts.filter((d) => d.type === 'request');
      const scratchpadRequestDrafts = allDrafts.filter((d) => d.type === 'scratchpad-request');

      // If there are scratchpad requests, show collection picker first
      if (scratchpadRequestDrafts.length > 0) {
        handleSaveScratchpadRequests();
        return;
      }

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

      dispatch(completeQuitFlow());
      onClose();
    } catch (error) {
      console.error('Error saving drafts:', error);
    }
  };

  if (totalDraftsCount === 0) {
    return null;
  }

  return (
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

      {scratchpadDrafts.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p className="font-medium text-yellow-800">
            {scratchpadDrafts.length} request(s) in Scratchpad need to be saved to a collection.
          </p>
        </div>
      )}

      <ul className="mt-4">
        {allDrafts.slice(0, MAX_UNSAVED_ITEMS_TO_SHOW).map((item, index) => {
          const prefix
            = item.type === 'collection'
              ? 'Collection: '
              : item.type === 'folder'
                ? 'Folder: '
                : item.type === 'scratchpad-request'
                  ? 'Scratchpad Request: '
                  : 'Request: ';
          return (
            <li key={`${item.type}-${item.collectionUid || item.uid}-${index}`} className="mt-1 text-xs">
              {prefix}
              {item.name || item.filename}
            </li>
          );
        })}
      </ul>

      {totalDraftsCount > MAX_UNSAVED_ITEMS_TO_SHOW && (
        <p className="mt-1 text-xs">
          ...{totalDraftsCount - MAX_UNSAVED_ITEMS_TO_SHOW} additional{' '}
          {pluralizeWord('item', totalDraftsCount - MAX_UNSAVED_ITEMS_TO_SHOW)} not shown
        </p>
      )}

      <div className="flex justify-between mt-6">
        <div>
          <button className="btn btn-sm btn-danger" onClick={closeWithoutSave}>
            Don't Save
          </button>
        </div>
        <div>
          <button className="btn btn-close btn-sm mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-secondary btn-sm" onClick={closeWithSave}>
            {totalDraftsCount > 1 ? 'Save All' : 'Save'}
          </button>
        </div>
      </div>

      {showCollectionPicker && (
        <SelectCollection
          title="Select Collection to Save Scratchpad Requests"
          onClose={() => {
            setShowCollectionPicker(false);
            setPendingScratchpadRequests([]);
          }}
          onSelect={handleCollectionSelected}
        />
      )}
    </Modal>
  );
};

export default SaveRequestsModal;
