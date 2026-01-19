import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'components/Modal/index';
import Button from 'ui/Button';
import SearchInput from 'components/SearchInput';
import { IconFolder, IconChevronRight, IconFolderPlus } from '@tabler/icons';
import { isSandboxCollection, findItemInCollection, isItemAFolder } from 'utils/collections';
import { sanitizeName } from 'utils/common/regex';
import { resolveRequestFilename } from 'utils/common/platform';
import { newFolder } from 'providers/ReduxStore/slices/collections/actions';
import NewFolder from 'components/Sidebar/NewFolder';
import StyledWrapper from './StyledWrapper';

const SaveSandboxRequestModal = ({ onClose, onSave, request }) => {
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  const [selectedCollectionUid, setSelectedCollectionUid] = useState(null);
  const [currentFolderPath, setCurrentFolderPath] = useState([]); // Array of folder UIDs representing breadcrumb path
  const [requestName, setRequestName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  const availableCollections = collections.filter((c) => !isSandboxCollection(c));

  // Auto-select first collection if available
  useEffect(() => {
    if (availableCollections.length > 0 && !selectedCollectionUid) {
      setSelectedCollectionUid(availableCollections[0].uid);
    }
  }, [availableCollections.length]);

  // Pre-fill request name from request object
  useEffect(() => {
    if (request?.name) {
      setRequestName(request.name);
    }
  }, [request?.name]);

  const selectedCollection = selectedCollectionUid
    ? collections.find((c) => c.uid === selectedCollectionUid)
    : null;

  // Get current parent item (collection root or folder based on breadcrumb path)
  const currentParentItem = useMemo(() => {
    if (!selectedCollection) return null;
    if (currentFolderPath.length === 0) {
      return selectedCollection;
    }
    const lastFolderUid = currentFolderPath[currentFolderPath.length - 1];
    return findItemInCollection(selectedCollection, lastFolderUid);
  }, [selectedCollection, currentFolderPath]);

  // Get folders from current parent
  const folders = useMemo(() => {
    if (!currentParentItem) return [];
    const allItems = currentParentItem.items || [];
    return allItems.filter((item) => isItemAFolder(item));
  }, [currentParentItem]);

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const query = searchQuery.toLowerCase();
    return folders.filter((folder) => folder.name.toLowerCase().includes(query));
  }, [folders, searchQuery]);

  // Build breadcrumbs from current folder path
  const breadcrumbs = useMemo(() => {
    if (!selectedCollection) return [];
    const crumbs = [
      { uid: null, name: selectedCollection.name, isCollection: true }
    ];
    // Build path by traversing through each folder level
    let currentParent = selectedCollection;
    currentFolderPath.forEach((folderUid) => {
      const folder = currentParent.items?.find((item) => item.uid === folderUid && isItemAFolder(item));
      if (folder) {
        crumbs.push({ uid: folderUid, name: folder.name, isCollection: false });
        currentParent = folder;
      }
    });
    return crumbs;
  }, [selectedCollection, currentFolderPath]);

  // Selected folder UID is the last folder in the path (or null if at collection root)
  const selectedFolderUid = currentFolderPath.length > 0 ? currentFolderPath[currentFolderPath.length - 1] : null;

  const handleCollectionChange = (collectionUid) => {
    setSelectedCollectionUid(collectionUid || null);
    setCurrentFolderPath([]);
    setSearchQuery('');
    setError('');
  };

  // Navigate into a folder (add to breadcrumb path)
  const handleFolderClick = (folderUid) => {
    setCurrentFolderPath((prev) => [...prev, folderUid]);
    setSearchQuery('');
    setError('');
  };

  // Navigate to a breadcrumb (go back in path)
  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      // Clicked on collection root
      setCurrentFolderPath([]);
    } else {
      // Clicked on a folder in the path - navigate to that point
      setCurrentFolderPath((prev) => prev.slice(0, index));
    }
    setSearchQuery('');
    setError('');
  };

  const handleNewFolderCreated = () => {
    setShowNewFolderModal(false);
    // Refresh will happen automatically via Redux state update
  };

  const validateAndSave = useCallback(() => {
    if (!selectedCollectionUid) {
      setError('Please select a collection');
      return;
    }

    if (!requestName || !requestName.trim()) {
      setError('Please enter a request name');
      return;
    }

    const sanitizedName = sanitizeName(requestName.trim());
    if (!sanitizedName) {
      setError('Invalid request name');
      return;
    }

    // Validate uniqueness
    if (!selectedCollection) {
      setError('Selected collection not found');
      return;
    }

    const parentItem = selectedFolderUid
      ? findItemInCollection(selectedCollection, selectedFolderUid)
      : selectedCollection;

    if (!parentItem) {
      setError('Selected location not found');
      return;
    }

    const existingItems = parentItem.items || [];
    const resolvedFilename = resolveRequestFilename(sanitizedName, selectedCollection.format);
    const requestExtensions = /\.(bru|yml|yaml)$/i;
    const filenameWithoutExt = resolvedFilename.replace(requestExtensions, '');

    const duplicateExists = existingItems.some((item) => {
      if (item.type === 'folder') return false;
      const itemFilename = item.filename || '';
      const itemFilenameWithoutExt = itemFilename.replace(requestExtensions, '');
      return itemFilenameWithoutExt === filenameWithoutExt;
    });

    if (duplicateExists) {
      setError('A request with this name already exists in the selected location');
      return;
    }

    setError('');
    onSave({
      targetCollectionUid: selectedCollectionUid,
      targetFolderUid: selectedFolderUid,
      requestName: sanitizedName
    });
  }, [selectedCollectionUid, selectedFolderUid, requestName, selectedCollection, onSave]);

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title="Save Request"
        handleCancel={onClose}
        handleConfirm={validateAndSave}
        confirmText="Save"
        cancelText="Cancel"
        hideFooter={true}
      >
        <div className="save-sandbox-modal-content">
          <div className="mb-4">
            <label htmlFor="request-name" className="block font-medium mb-2">
              Request name
            </label>
            <input
              id="request-name"
              type="text"
              className="block textbox mt-2 w-full"
              value={requestName}
              onChange={(e) => {
                setRequestName(e.target.value);
                setError('');
              }}
              placeholder="Enter request name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
          </div>

          {availableCollections.length > 0 && (
            <>
              <div className="mb-4">
                <label htmlFor="collection-select" className="block font-medium mb-2">
                  Save to Collections
                </label>
                {availableCollections.length > 1 ? (
                  <select
                    id="collection-select"
                    className="block textbox mt-2 w-full"
                    value={selectedCollectionUid || ''}
                    onChange={(e) => handleCollectionChange(e.target.value)}
                  >
                    {availableCollections.map((collection) => (
                      <option key={collection.uid} value={collection.uid}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="collection-path">
                    {selectedCollection && (
                      <span className="collection-path-text">
                        {selectedCollection.name}
                        {selectedFolderUid && (
                          <>
                            {' > '}
                            {findItemInCollection(selectedCollection, selectedFolderUid)?.name}
                          </>
                        )}
                        {' >'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {selectedCollection && (
                <div className="mb-4">
                  {/* Breadcrumbs */}
                  {breadcrumbs.length > 0 && (
                    <div className="breadcrumbs mb-2">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.uid || 'root'}>
                          {index > 0 && <span className="breadcrumb-separator">{'>'}</span>}
                          <button
                            type="button"
                            className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                            onClick={() => handleBreadcrumbClick(index)}
                          >
                            {crumb.name}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  <SearchInput
                    searchText={searchQuery}
                    setSearchText={setSearchQuery}
                    placeholder="Search for folder"
                    className="mb-2"
                    autoFocus={false}
                  />

                  <div className="folders-list">
                    {filteredFolders.length === 0 ? (
                      <div className="empty-state">
                        <span>{searchQuery ? 'No folders found' : 'No folders in this location'}</span>
                      </div>
                    ) : (
                      filteredFolders.map((folder) => (
                        <div
                          key={folder.uid}
                          className="folder-item"
                          onClick={() => handleFolderClick(folder.uid)}
                        >
                          <IconFolder size={16} strokeWidth={1.5} />
                          <span className="folder-name">{folder.name}</span>
                          <IconChevronRight size={16} strokeWidth={1.5} className="chevron" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {availableCollections.length === 0 && (
            <div className="empty-collections-message">
              <p>No collections available. Please create a collection first.</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Custom Footer */}
        <div className="modal-custom-footer">
          <Button
            type="button"
            color="primary"
            onClick={() => {
              if (selectedCollectionUid) {
                setShowNewFolderModal(true);
              }
            }}
            disabled={!selectedCollectionUid}
            className="new-folder-button"
          >
            <IconFolderPlus size={16} strokeWidth={1.5} />
            New Folder
          </Button>
          <div className="footer-right-buttons">
            <Button type="button" color="secondary" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" color="primary" onClick={validateAndSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {showNewFolderModal && selectedCollectionUid && (
        <NewFolder
          collectionUid={selectedCollectionUid}
          item={selectedFolderUid ? findItemInCollection(selectedCollection, selectedFolderUid) : null}
          onClose={handleNewFolderCreated}
        />
      )}
    </StyledWrapper>
  );
};

export default SaveSandboxRequestModal;
