import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  padding-top: 4px;
  padding-bottom: 4px;

  .scratchpad-content {
    flex: 1 1 0%;
    min-height: 0;
    padding-top: 4px;
    padding-bottom: 4px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scratchpad-list {
    flex: 1 1 0%;
    min-height: 0;
    padding-top: 4px;
    padding-bottom: 4px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scratchpad-empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 24px 12px;
    text-align: center;
  }

  .empty-state-text {
    font-size: 12px;
    color: ${(props) => props.theme.colors.text.muted};
    margin: 0;
  }
`;

export default StyledWrapper;
