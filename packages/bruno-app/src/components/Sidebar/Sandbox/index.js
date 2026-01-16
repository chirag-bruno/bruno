import React from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import { isSandboxCollection, isItemARequest } from 'utils/collections';
import CollectionItem from '../Collections/Collection/CollectionItem';
import StyledWrapper from './StyledWrapper';

const Sandbox = () => {
  const { collections } = useSelector((state) => state.collections);
  const sandboxCollection = collections.find((c) => isSandboxCollection(c));

  if (!sandboxCollection) {
    return null;
  }

  // Sort request items by sequence
  const sortItemsBySequence = (items = []) => {
    return items.sort((a, b) => a.seq - b.seq);
  };

  const requestItems = sortItemsBySequence(filter(sandboxCollection.items, (i) => isItemARequest(i)));

  return (
    <StyledWrapper>
      {requestItems.length === 0 ? (
        <div className="sandbox-empty-state">
          <p className="empty-state-text">Click + to create a new request</p>
        </div>
      ) : (
        <div className="sandbox-list">
          {requestItems.map((item) => (
            <CollectionItem
              key={item.uid}
              item={item}
              collectionUid={sandboxCollection.uid}
              collectionPathname={sandboxCollection.pathname}
              searchText=""
            />
          ))}
        </div>
      )}
    </StyledWrapper>
  );
};

export default Sandbox;
