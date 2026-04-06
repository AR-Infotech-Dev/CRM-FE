import ActionButton from "../../components/ui/ActionButton";

function ModulePageLayout({
  title,
  description,
  controls,
  table,
  footer,
}) {
  return (
    <section className="module-page">
      <div className="module-controls-card">
        <div className="module-page-header">
          <div className="module-page-heading">
            <h2 className="module-page-title">{title}</h2>
            {description ? <p className="module-page-description">{description}</p> : null}
          </div>
        </div>
        {controls}
      </div>
      <div className="module-table-panel">{table}</div>
      {footer ? <div className="module-table-footer">{footer}</div> : null}
    </section>
  );
}

export default ModulePageLayout;
