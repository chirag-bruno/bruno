import styled from 'styled-components';

const StyledWrapper = styled.div`
  .transient-request-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: ${(props) => props.theme.requestTabPanel.card.bg};
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.requestTabPanel.card.border};
  }

  .transient-request-name {
    font-size: ${(props) => props.theme.font.size.sm};
    color: ${(props) => props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .transient-request-collection {
    font-size: ${(props) => props.theme.font.size.xs};
    color: ${(props) => props.theme.colors.text.muted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .draft-list-item {
    color: ${(props) => props.theme.colors.text.muted};
  }

  .draft-list-muted {
    color: ${(props) => props.theme.colors.text.subtext1};
  }
`;

export default StyledWrapper;
