import styled from 'styled-components';

const StyledWrapper = styled.div`
  .save-sandbox-modal-content {
    min-height: 300px;
  }

  .collection-path {
    padding: 8px 12px;
    background-color: ${(props) => props.theme.input.bg};
    border: 1px solid ${(props) => props.theme.input.border};
    border-radius: ${(props) => props.theme.border.radius.sm};
    min-height: 2.1rem;
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }

  .collection-path-text {
    font-size: 14px;
    color: ${(props) => props.theme.text};
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px 12px;
    background-color: ${(props) => props.theme.input.bg};
    border: 1px solid ${(props) => props.theme.input.border};
    border-radius: ${(props) => props.theme.border.radius.sm};
    min-height: 2.1rem;
  }

  .breadcrumb-item {
    background: none;
    border: none;
    padding: 0;
    font-size: 14px;
    color: ${(props) => props.theme.text};
    cursor: pointer;
    transition: color 0.15s;
    text-decoration: none;

    &:hover {
      color: ${(props) => props.theme.colors?.primary || props.theme.primary?.solid};
      text-decoration: underline;
    }

    &.active {
      color: ${(props) => props.theme.text};
      font-weight: 500;
      cursor: default;
      text-decoration: none;

      &:hover {
        color: ${(props) => props.theme.text};
        text-decoration: none;
      }
    }
  }

  .breadcrumb-separator {
    color: ${(props) => props.theme.colors?.text?.secondary || props.theme.textMuted};
    font-size: 14px;
    user-select: none;
  }

  .folders-list {
    border: 1px solid ${(props) => props.theme.input.border};
    border-radius: ${(props) => props.theme.border.radius.sm};
    background-color: ${(props) => props.theme.input.bg};
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 0.5rem;
  }

  .folder-item {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.15s;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;

    &:hover {
      background-color: ${(props) => props.theme.plainGrid?.hoverBg || 'rgba(0, 0, 0, 0.05)'};
    }

    &.selected {
      background-color: ${(props) => {
        // Use a blue highlight similar to the image
        if (props.theme.bg === '#1e1e1e' || props.theme.bg === '#0d1117') {
          return 'rgba(56, 139, 253, 0.2)';
        }
        return 'rgba(56, 139, 253, 0.15)';
      }};

      .folder-name {
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
  }

  .folder-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: ${(props) => props.theme.text};
  }

  .chevron {
    color: ${(props) => props.theme.colors?.text?.secondary || props.theme.textMuted};
    flex-shrink: 0;
  }

  .empty-state {
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colors?.text?.secondary || props.theme.textMuted};
    font-size: 13px;
  }

  .empty-collections-message {
    padding: 20px;
    text-align: center;
    color: ${(props) => props.theme.colors?.text?.secondary || props.theme.textMuted};
    font-size: 14px;
  }

  .error-message {
    color: ${(props) => props.theme.colors?.text?.danger || '#ef4444'};
    font-size: 12px;
    margin-top: 8px;
    padding: 8px;
    background-color: ${(props) => (props.theme.bg === '#1e1e1e' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')};
    border-radius: ${(props) => props.theme.border.radius.sm};
    border: 1px solid ${(props) => props.theme.colors?.text?.danger || '#ef4444'};
  }

  .modal-custom-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-top: 1px solid ${(props) => props.theme.border?.border0 || props.theme.border};
    background-color: ${(props) => props.theme.modal?.body?.bg || props.theme.colors?.background};
    border-bottom-left-radius: ${(props) => props.theme.border?.radius?.base || '8px'};
    border-bottom-right-radius: ${(props) => props.theme.border?.radius?.base || '8px'};
  }

  .new-folder-button {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .footer-right-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

export default StyledWrapper;
