import React from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import { isScratchpadCollection, isItemARequest } from 'utils/collections';
import CollectionItem from '../Collections/Collection/CollectionItem';
import StyledWrapper from './StyledWrapper';

const Scratchpad = () => {
  const { collections } = useSelector((state) => state.collections);
  const scratchpadCollection = collections.find((c) => isScratchpadCollection(c));

  if (!scratchpadCollection) {
    return null;
  }

  // Sort request items by sequence
  const sortItemsBySequence = (items = []) => {
    return items.sort((a, b) => a.seq - b.seq);
  };

  const requestItems = sortItemsBySequence(filter(scratchpadCollection.items, (i) => isItemARequest(i)));

  return (
    <StyledWrapper>
      {requestItems.length === 0 ? (
        <div className="scratchpad-empty-state">
          <p className="empty-state-text">Click + to create a new request</p>
        </div>
      ) : (
        <div className="scratchpad-list">
          {requestItems.map((item) => (
            <CollectionItem
              key={item.uid}
              item={item}
              collectionUid={scratchpadCollection.uid}
              collectionPathname={scratchpadCollection.pathname}
              searchText=""
            />
          ))}
        </div>
      )}
    </StyledWrapper>
  );
};

export default Scratchpad;
