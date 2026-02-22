import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconPlus, IconFolder, IconDownload, IconFileText, IconApi, IconBrandGraphql, IconServer, IconWebhook } from '@tabler/icons';
import toast from 'react-hot-toast';
import filter from 'lodash/filter';
import CreateCollection from 'components/Sidebar/CreateCollection';
import ImportCollection from 'components/Sidebar/ImportCollection';
import ImportCollectionLocation from 'components/Sidebar/ImportCollectionLocation';
import BulkImportCollectionLocation from 'components/Sidebar/BulkImportCollectionLocation';
import CloneGitRepository from 'components/Sidebar/CloneGitRespository';
import CollectionsList from 'components/WorkspaceHome/WorkspaceOverview/CollectionsList';
import WorkspaceDocsModal from 'components/WorkspaceHome/WorkspaceDocsModal';
import { importCollection, openCollection, importCollectionFromZip, newHttpRequest } from 'providers/ReduxStore/slices/collections/actions';
import { flattenItems, isItemTransientRequest } from 'utils/collections';
import { sanitizeName } from 'utils/common/regex';
import { formatIpcError } from 'utils/common/error';
import Button from 'ui/Button';
import StyledWrapper from './StyledWrapper';

/**
 * Generate a request name for transient requests in the pattern "Untitled {Count}"
 */
const generateTransientRequestName = (collection) => {
  if (!collection || !collection.items) {
    return 'Untitled 1';
  }
  const allItems = flattenItems(collection.items);
  const transientRequests = filter(allItems, (item) => isItemTransientRequest(item));

  let maxNumber = 0;
  transientRequests.forEach((item) => {
    const match = item.name?.match(/^Untitled (\d+)$/);
    if (match) {
      const number = parseInt(match[1], 10);
      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  });

  return `Untitled ${maxNumber + 1}`;
};

const ScratchEmptyState = ({ scratchCollectionUid }) => {
  const dispatch = useDispatch();
  const { activeWorkspaceUid, workspaces } = useSelector((state) => state.workspaces);
  const collections = useSelector((state) => state.collections.collections);
  const { globalEnvironments } = useSelector((state) => state.globalEnvironments);

  const activeWorkspace = workspaces.find((w) => w.uid === activeWorkspaceUid);

  const scratchCollection = useMemo(() => {
    return collections?.find((c) => c.uid === scratchCollectionUid);
  }, [collections, scratchCollectionUid]);

  const [createCollectionModalOpen, setCreateCollectionModalOpen] = useState(false);
  const [importCollectionModalOpen, setImportCollectionModalOpen] = useState(false);
  const [importCollectionLocationModalOpen, setImportCollectionLocationModalOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [showCloneGitModal, setShowCloneGitModal] = useState(false);
  const [gitRepositoryUrl, setGitRepositoryUrl] = useState(null);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const workspaceCollectionsCount = activeWorkspace?.collections?.length || 0;
  const workspaceEnvironmentsCount = globalEnvironments?.length || 0;

  const handleAddRequest = useCallback((requestType = 'http-request') => {
    if (!scratchCollection) return;

    const uniqueName = generateTransientRequestName(scratchCollection);
    const filename = sanitizeName(uniqueName);

    dispatch(
      newHttpRequest({
        requestName: uniqueName,
        filename: filename,
        requestType: requestType,
        requestUrl: '',
        requestMethod: 'GET',
        collectionUid: scratchCollection.uid,
        itemUid: null,
        isTransient: true
      })
    ).catch((err) => toast.error(formatIpcError(err) || 'An error occurred while adding the request'));
  }, [dispatch, scratchCollection]);

  const handleCreateCollection = async () => {
    if (!activeWorkspace?.pathname) {
      toast.error('Workspace path not found');
      return;
    }

    try {
      const { ipcRenderer } = window;
      await ipcRenderer.invoke('renderer:ensure-collections-folder', activeWorkspace.pathname);
      setCreateCollectionModalOpen(true);
    } catch (error) {
      console.error('Error ensuring collections folder exists:', error);
      toast.error('Error preparing workspace for collection creation');
    }
  };

  const handleOpenCollection = () => {
    dispatch(openCollection()).catch((err) => {
      console.error(err);
      toast.error('An error occurred while opening the collection');
    });
  };

  const handleImportCollection = () => {
    setImportCollectionModalOpen(true);
  };

  const handleImportCollectionSubmit = ({ rawData, type, repositoryUrl, ...rest }) => {
    setImportCollectionModalOpen(false);

    if (type === 'git-repository') {
      setGitRepositoryUrl(repositoryUrl);
      setShowCloneGitModal(true);
      return;
    }

    setImportData({ rawData, type, ...rest });
    setImportCollectionLocationModalOpen(true);
  };

  const handleImportCollectionLocation = (convertedCollection, collectionLocation, options = {}) => {
    const importAction = options.isZipImport
      ? importCollectionFromZip(convertedCollection.zipFilePath, collectionLocation)
      : importCollection(convertedCollection, collectionLocation, options);

    dispatch(importAction)
      .then(() => {
        setImportCollectionLocationModalOpen(false);
        setImportData(null);
      });
  };

  const handleCloseGitModal = () => {
    setShowCloneGitModal(false);
    setGitRepositoryUrl(null);
  };

  return (
    <StyledWrapper>
      {createCollectionModalOpen && (
        <CreateCollection onClose={() => setCreateCollectionModalOpen(false)} />
      )}

      {importCollectionModalOpen && (
        <ImportCollection
          onClose={() => setImportCollectionModalOpen(false)}
          handleSubmit={handleImportCollectionSubmit}
        />
      )}

      {importCollectionLocationModalOpen && importData && (importData.type !== 'multiple' && importData.type !== 'bulk') && (
        <ImportCollectionLocation
          rawData={importData.rawData}
          format={importData.type}
          onClose={() => setImportCollectionLocationModalOpen(false)}
          handleSubmit={handleImportCollectionLocation}
        />
      )}
      {importCollectionLocationModalOpen && importData && (importData.type === 'multiple' || importData.type === 'bulk') && (
        <BulkImportCollectionLocation
          importData={importData}
          onClose={() => setImportCollectionLocationModalOpen(false)}
          handleSubmit={handleImportCollectionLocation}
        />
      )}
      {showCloneGitModal && (
        <CloneGitRepository
          onClose={handleCloseGitModal}
          onFinish={handleCloseGitModal}
          collectionRepositoryUrl={gitRepositoryUrl}
        />
      )}
      {showDocsModal && activeWorkspace && (
        <WorkspaceDocsModal
          workspace={activeWorkspace}
          onClose={() => setShowDocsModal(false)}
        />
      )}

      <div className="overview-layout">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{workspaceCollectionsCount}</span>
            <span className="stat-label">Collections</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{workspaceEnvironmentsCount}</span>
            <span className="stat-label">Environments</span>
          </div>
        </div>

        <div className="new-request-section">
          <div className="section-title">New Request</div>
          <div className="request-type-buttons">
            <button className="request-type-btn" onClick={() => handleAddRequest('http-request')}>
              <IconApi size={14} strokeWidth={1.5} className="icon-http" />
              <span>HTTP</span>
            </button>
            <button className="request-type-btn" onClick={() => handleAddRequest('graphql-request')}>
              <IconBrandGraphql size={14} strokeWidth={1.5} className="icon-graphql" />
              <span>GraphQL</span>
            </button>
            <button className="request-type-btn" onClick={() => handleAddRequest('grpc-request')}>
              <IconServer size={14} strokeWidth={1.5} className="icon-grpc" />
              <span>gRPC</span>
            </button>
            <button className="request-type-btn" onClick={() => handleAddRequest('ws-request')}>
              <IconWebhook size={14} strokeWidth={1.5} className="icon-websocket" />
              <span>WebSocket</span>
            </button>
          </div>
        </div>

        <div className="quick-actions-section">
          <div className="section-title">Quick Actions</div>
          <div className="quick-actions-buttons">
            <Button
              color="light"
              size="sm"
              icon={<IconPlus size={14} strokeWidth={1.5} />}
              onClick={handleCreateCollection}
            >
              Create Collection
            </Button>
            <Button
              color="light"
              size="sm"
              icon={<IconFolder size={14} strokeWidth={1.5} />}
              onClick={handleOpenCollection}
            >
              Open Collection
            </Button>
            <Button
              color="light"
              size="sm"
              icon={<IconDownload size={14} strokeWidth={1.5} />}
              onClick={handleImportCollection}
            >
              Import Collection
            </Button>
            <Button
              color="light"
              size="sm"
              icon={<IconFileText size={14} strokeWidth={1.5} />}
              onClick={() => setShowDocsModal(true)}
            >
              View Docs
            </Button>
          </div>
        </div>

        {activeWorkspace && (
          <div className="collections-section">
            <div className="section-title">Collections</div>
            <CollectionsList workspace={activeWorkspace} />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default ScratchEmptyState;
