import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal/index';
import { IconFiles, IconFolder, IconChevronRight, IconChevronDown, IconFile, IconSearch, IconDotsVertical } from '@tabler/icons';
import { isSandboxCollection, findItemInCollection, isItemAFolder, isItemARequest } from 'utils/collections';
import { sanitizeName } from 'utils/common/regex';
import { resolveRequestFilename } from 'utils/common/platform';
import StyledWrapper from './StyledWrapper';

const TreeItem = ({ item, collection, selectedFolderUid, onFolderSelect, expandedFolders, onToggleFolder, level = 0 }) => {
  const isFolder = isItemAFolder(item);
  const isRequest = isItemARequest(item);
  const isSelected = selectedFolderUid === item.uid;
  const isExpanded = expandedFolders.has(item.uid);
  const hasChildren = item.items && item.items.length > 0;
  const childItems = item.items || [];

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFolder) {
      onFolderSelect(item.uid);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isFolder) {
      onToggleFolder(item.uid);
    }
  };

  if (isRequest) {
    return null; // Don't show requests in the tree for folder selection
  }

  return (
    <div className="tree-item-wrapper">
      <div
        className={`tree-item ${isFolder ? 'folder-item' : ''} ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
      >
        <div className="tree-item-content">
          {hasChildren ? (
            <div className="tree-toggle" onClick={handleToggle}>
              {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
            </div>
          ) : (
            <div className="tree-toggle-placeholder" />
          )}
          {isFolder ? (
            <IconFolder size={16} strokeWidth={1.5} />
          ) : (
            <IconFile size={16} strokeWidth={1.5} />
          )}
          <span className="tree-item-label">{item.name}</span>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {childItems.map((childItem) => (
            <TreeItem
              key={childItem.uid}
              item={childItem}
              collection={collection}
              selectedFolderUid={selectedFolderUid}
              onFolderSelect={onFolderSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SaveSandboxRequestModal = ({ onClose, onSave, request }) => {
  const { collections } = useSelector((state) => state.collections);
  const [selectedCollectionUid, setSelectedCollectionUid] = useState(null);
  const [selectedFolderUid, setSelectedFolderUid] = useState(null);
  const [requestName, setRequestName] = useState('');
  const [error, setError] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Reset state when modal opens (on mount)
  useEffect(() => {
    setSelectedCollectionUid(null);
    setSelectedFolderUid(null);
    setRequestName('');
    setError('');
    setExpandedFolders(new Set());
  }, []); // Reset on mount to ensure clean state when reopening

  const availableCollections = collections.filter((c) => !isSandboxCollection(c));
  const selectedCollection = selectedCollectionUid
    ? collections.find((c) => c.uid === selectedCollectionUid)
    : null;

  const allItems = selectedCollection
    ? (selectedCollection.items || [])
    : [];

  const handleToggleFolder = useCallback((folderUid) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderUid)) {
        newSet.delete(folderUid);
      } else {
        newSet.add(folderUid);
      }
      return newSet;
    });
  }, []);

  const handleCollectionChange = (e) => {
    const collectionUid = e.target.value;
    setSelectedCollectionUid(collectionUid || null);
    setSelectedFolderUid(null);
    setExpandedFolders(new Set());
    setError('');
  };

  const handleRootSelect = () => {
    setSelectedFolderUid(null);
    setError('');
  };

  const handleFolderSelect = (folderUid) => {
    setSelectedFolderUid(folderUid);
    setError('');
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
        title="Save Request to Collection"
        handleCancel={onClose}
        handleConfirm={validateAndSave}
        confirmText="Save"
        cancelText="Cancel"
      >
        <div className="save-sandbox-modal-content">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Request Name</label>
            <input
              type="text"
              className="input"
              value={requestName}
              onChange={(e) => {
                setRequestName(e.target.value);
                setError('');
              }}
              placeholder="Enter request name"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Collection</label>
            <select
              className="select-input"
              value={selectedCollectionUid || ''}
              onChange={handleCollectionChange}
            >
              <option value="">Select a collection...</option>
              {availableCollections.map((collection) => (
                <option key={collection.uid} value={collection.uid}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCollection && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="tree-container">
                <div className="tree-header">
                  <div className="tree-header-title">{selectedCollection.name}</div>
                  <div className="tree-header-actions">
                    <button className="tree-header-action" type="button" title="Search">
                      <IconSearch size={14} strokeWidth={1.5} />
                    </button>
                    <button className="tree-header-action" type="button" title="More options">
                      <IconDotsVertical size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <div className="tree-content">
                  {allItems.length === 0 ? (
                    <div className="tree-empty-state">
                      <span>No items in this collection</span>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`tree-item root-item ${selectedFolderUid === null ? 'selected' : ''}`}
                        onClick={handleRootSelect}
                      >
                        <div className="tree-item-content">
                          <div className="tree-toggle-placeholder" />
                          <IconFiles size={16} strokeWidth={1.5} />
                          <span className="tree-item-label">Collection Root</span>
                        </div>
                      </div>
                      {allItems.map((item) => (
                        <TreeItem
                          key={item.uid}
                          item={item}
                          collection={selectedCollection}
                          selectedFolderUid={selectedFolderUid}
                          onFolderSelect={handleFolderSelect}
                          expandedFolders={expandedFolders}
                          onToggleFolder={handleToggleFolder}
                          level={0}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default SaveSandboxRequestModal;
