import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconColorSwatch, IconPlus, IconChevronRight, IconApi, IconBrandGraphql, IconPlugConnected, IconCode } from '@tabler/icons';
import Sandbox from 'components/Sidebar/Sandbox';
import ActionIcon from 'ui/ActionIcon';
import MenuDropdown from 'ui/MenuDropdown';
import SidebarSection from 'components/Sidebar/SidebarSection';
import { isSandboxCollection } from 'utils/collections';
import { newHttpRequest, newGrpcRequest, newWsRequest } from 'providers/ReduxStore/slices/collections/actions';
import { generateUniqueRequestName } from 'utils/collections';
import { sanitizeName } from 'utils/common/regex';
import { updateSandboxLastRequestType } from 'providers/ReduxStore/slices/app';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import { hideHomePage, hideApiSpecPage } from 'providers/ReduxStore/slices/app';
import toast from 'react-hot-toast';

const SandboxSection = () => {
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  const lastCreatedRequestType = useSelector((state) => state.app.sandbox.lastCreatedRequestType);
  const sandboxCollection = collections.find((c) => isSandboxCollection(c));
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const ignoreNextMenuOpenRef = useRef(false);

  if (!sandboxCollection) {
    return null;
  }

  const handleCreateRequest = useCallback(async (requestType) => {
    const uniqueName = await generateUniqueRequestName(sandboxCollection, 'Untitled', null);
    const filename = sanitizeName(uniqueName);

    // Update last created request type
    dispatch(updateSandboxLastRequestType(requestType));

    try {
      if (requestType === 'http-request') {
        await dispatch(
          newHttpRequest({
            requestName: uniqueName,
            filename: filename,
            requestType: 'http-request',
            requestUrl: '',
            requestMethod: 'GET',
            collectionUid: sandboxCollection.uid,
            itemUid: null
          })
        );
      } else if (requestType === 'graphql-request') {
        await dispatch(
          newHttpRequest({
            requestName: uniqueName,
            filename: filename,
            requestType: 'graphql-request',
            requestUrl: '',
            requestMethod: 'POST',
            collectionUid: sandboxCollection.uid,
            itemUid: null,
            body: {
              mode: 'graphql',
              graphql: {
                query: '',
                variables: ''
              }
            }
          })
        );
      } else if (requestType === 'ws-request') {
        await dispatch(
          newWsRequest({
            requestName: uniqueName,
            filename: filename,
            requestUrl: '',
            requestMethod: 'ws',
            collectionUid: sandboxCollection.uid,
            itemUid: null
          })
        );
      } else if (requestType === 'grpc-request') {
        await dispatch(
          newGrpcRequest({
            requestName: uniqueName,
            filename: filename,
            requestUrl: '',
            collectionUid: sandboxCollection.uid,
            itemUid: null
          })
        );
      }
      toast.success('New request created!');
    } catch (err) {
      toast.error(err ? err.message : 'An error occurred while adding the request');
    }
  }, [dispatch, sandboxCollection]);

  const handleAddClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // MenuDropdown always toggles on click. We want left-click to be "quick add" without opening the menu.
    ignoreNextMenuOpenRef.current = true;
    setIsAddMenuOpen(false);
    handleCreateRequest(lastCreatedRequestType);
  }, [handleCreateRequest, lastCreatedRequestType]);

  const handleAddContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddMenuOpen(true);
  }, []);

  const handleAddMenuChange = useCallback((nextOpen) => {
    // Ignore the "open" request coming from left-click (quick-add)
    if (ignoreNextMenuOpenRef.current && nextOpen === true) {
      ignoreNextMenuOpenRef.current = false;
      return;
    }
    ignoreNextMenuOpenRef.current = false;
    setIsAddMenuOpen(nextOpen);
  }, []);

  const addRequestMenuItems = useMemo(() => [
    {
      id: 'http',
      label: 'HTTP',
      leftSection: <IconApi size={16} strokeWidth={2} />,
      onClick: () => handleCreateRequest('http-request')
    },
    {
      id: 'graphql',
      label: 'GraphQL',
      leftSection: <IconBrandGraphql size={16} strokeWidth={2} />,
      onClick: () => handleCreateRequest('graphql-request')
    },
    {
      id: 'websocket',
      label: 'WebSocket',
      leftSection: <IconPlugConnected size={16} strokeWidth={2} />,
      onClick: () => handleCreateRequest('ws-request')
    },
    {
      id: 'grpc',
      label: 'gRPC',
      leftSection: <IconCode size={16} strokeWidth={2} />,
      onClick: () => handleCreateRequest('grpc-request')
    }
  ], [handleCreateRequest]);

  const handleOpenCollection = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(hideHomePage());
    dispatch(hideApiSpecPage());
    dispatch(
      addTab({
        uid: sandboxCollection.uid,
        collectionUid: sandboxCollection.uid,
        type: 'collection-settings'
      })
    );
  }, [dispatch, sandboxCollection]);

  const sectionActions = (
    <>
      <MenuDropdown
        items={addRequestMenuItems}
        placement="bottom-end"
        autoFocusFirstOption={true}
        opened={isAddMenuOpen}
        onChange={handleAddMenuChange}
      >
        <ActionIcon
          onClick={handleAddClick}
          onContextMenu={handleAddContextMenu}
          aria-label="Add new request"
          title="Add new request (left-click: quick add, right-click: choose type)"
        >
          <IconPlus size={14} stroke={1.5} aria-hidden="true" />
        </ActionIcon>
      </MenuDropdown>
    </>
  );

  return (
    <SidebarSection
      id="sandbox"
      title="Sandbox"
      icon={IconColorSwatch}
      actions={sectionActions}
      className="sandbox-section"
    >
      <Sandbox />
    </SidebarSection>
  );
};

export default SandboxSection;
