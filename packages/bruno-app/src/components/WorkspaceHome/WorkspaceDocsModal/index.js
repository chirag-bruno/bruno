import React from 'react';
import Modal from 'components/Modal';
import WorkspaceDocs from 'components/WorkspaceHome/WorkspaceDocs';
import StyledWrapper from './StyledWrapper';

const WorkspaceDocsModal = ({ workspace, onClose }) => {
  return (
    <Modal
      size="lg"
      title="Workspace Documentation"
      handleCancel={onClose}
      hideFooter
    >
      <StyledWrapper>
        <WorkspaceDocs workspace={workspace} />
      </StyledWrapper>
    </Modal>
  );
};

export default WorkspaceDocsModal;
