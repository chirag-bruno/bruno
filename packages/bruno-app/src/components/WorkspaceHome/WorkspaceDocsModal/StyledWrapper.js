import styled from 'styled-components';

const StyledWrapper = styled.div`
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;

  .docs-header {
    padding-bottom: 8px;
    border-bottom: 1px solid ${(props) => props.theme.workspace.border};
    margin-bottom: 12px;
  }

  .docs-content {
    height: auto;
    min-height: 300px;
  }

  .editor-container {
    height: 350px;
  }
`;

export default StyledWrapper;
