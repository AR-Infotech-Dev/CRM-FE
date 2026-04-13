function FlyoutPanel({ isOpen, onClose, title, closeButton, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="flyout-overlay " onClick={onClose}>
      <aside className="flyout-panel" onClick={(event) => event.stopPropagation()}>
        {closeButton}
        <div className="overlay_header">
          <div className="ws_container">
            <h2 className="page_title">DDD{title}</h2>
          </div>
        </div>

        <div className="tab-pane panel_overflow">
          {children}
        </div>
        <div className="flyout-footer">{footer}</div>
      </aside>
    </div>
  );
}

export default FlyoutPanel;
