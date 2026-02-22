import styled from 'styled-components';

const StyledWrapper = styled.div`
  height: 100%;

  .overview-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 16px 16px;
    overflow-y: auto;
  }

  .stats-row {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 600;
    color: ${(props) => props.theme.text};
    line-height: 1;
  }

  .stat-label {
    font-size: ${(props) => props.theme.font.size.xs};
    color: ${(props) => props.theme.colors.text.muted};
  }

  .new-request-section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: ${(props) => props.theme.font.size.sm};
    font-weight: 500;
    color: ${(props) => props.theme.colors.text.muted};
    margin-bottom: 8px;
  }

  .request-type-buttons {
    display: flex;
    gap: 8px;
  }

  .request-type-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: transparent;
    border: 1px solid ${(props) => props.theme.input.border};
    border-radius: ${(props) => props.theme.border.radius.base};
    font-size: ${(props) => props.theme.font.size.sm};
    color: ${(props) => props.theme.text};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: ${(props) => props.theme.colors.text.muted};
      background: ${(props) => props.theme.sidebar.collection.item.hoverBg};
    }

    .icon-http {
      color: rgb(34, 197, 94);
    }

    .icon-graphql {
      color: rgb(236, 72, 153);
    }

    .icon-grpc {
      color: rgb(168, 85, 247);
    }

    .icon-websocket {
      color: rgb(59, 130, 246);
    }
  }

  .quick-actions-section {
    margin-bottom: 16px;
    padding-top: 16px;
    border-top: 1px solid ${(props) => props.theme.workspace.border};
  }

  .quick-actions-buttons {
    display: flex;
    gap: 8px;
  }

  .collections-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 16px;
    border-top: 1px solid ${(props) => props.theme.workspace.border};
  }
`;

export default StyledWrapper;
