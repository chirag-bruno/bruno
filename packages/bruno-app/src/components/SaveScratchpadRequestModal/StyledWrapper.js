import styled from 'styled-components';

const StyledWrapper = styled.div`
  .save-scratchpad-modal-content {
    min-height: 300px;
  }

  .select-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text.primary};
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.primary};
    }

    &:hover {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  .tree-container {
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 4px;
    background-color: ${(props) => props.theme.colors.background};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 400px;
  }

  .tree-header {
    padding: 10px 12px;
    background-color: ${(props) => props.theme.plainGrid.headerBg || props.theme.colors.background};
    border-bottom: 1px solid ${(props) => props.theme.border};
    position: sticky;
    top: 0;
    z-index: 10;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tree-header-title {
    font-size: 13px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text.primary};
    flex: 1;
  }

  .tree-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tree-header-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    color: ${(props) => props.theme.colors.text.secondary};
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.15s;
    padding: 0;

    &:hover {
      background-color: ${(props) => props.theme.plainGrid.hoverBg || 'rgba(0, 0, 0, 0.05)'};
      color: ${(props) => props.theme.colors.text.primary};
    }

    &:focus {
      outline: none;
      background-color: ${(props) => props.theme.plainGrid.hoverBg || 'rgba(0, 0, 0, 0.05)'};
    }
  }

  .tree-content {
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    padding: 4px;
    min-height: 150px;
  }

  .tree-empty-state {
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colors.text.secondary};
    font-size: 13px;
  }

  .tree-item-wrapper {
    width: 100%;
  }

  .tree-item {
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.15s;
    user-select: none;
    min-height: 24px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: ${(props) => props.theme.plainGrid.hoverBg || 'rgba(0, 0, 0, 0.05)'};
    }

    &.selected {
      background-color: ${(props) => {
        // Use a blue highlight similar to the image
        if (props.theme.bg === '#1e1e1e' || props.theme.bg === '#0d1117') {
          return 'rgba(56, 139, 253, 0.2)';
        }
        return 'rgba(56, 139, 253, 0.15)';
      }};
      color: ${(props) => props.theme.colors.text.primary};

      .tree-item-label {
        font-weight: 500;
        color: ${(props) => {
          if (props.theme.bg === '#1e1e1e' || props.theme.bg === '#0d1117') {
            return '#60a5fa';
          }
          return '#2563eb';
        }};
      }

      svg {
        color: ${(props) => {
          if (props.theme.bg === '#1e1e1e' || props.theme.bg === '#0d1117') {
            return '#60a5fa';
          }
          return '#2563eb';
        }};
      }
    }

    &.root-item {
      font-weight: 500;
    }
  }

  .tree-item-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 4px;
  }

  .tree-toggle,
  .tree-toggle-placeholder {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${(props) => props.theme.colors.text.secondary};
  }

  .tree-toggle {
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: ${(props) => props.theme.colors.text.primary};
    }
  }

  .tree-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }

  .error-message {
    color: ${(props) => props.theme.colors.text.danger};
    font-size: 12px;
    margin-top: 8px;
    padding: 8px;
    background-color: ${(props) => (props.theme.bg === '#1e1e1e' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')};
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.colors.text.danger};
  }
`;

export default StyledWrapper;
