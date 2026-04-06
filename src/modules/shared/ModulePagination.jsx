function ModulePagination({ summary = "Showing 1 to 20 of 83 entries" }) {
  return (
    <div className="module-pagination">
      <div className="module-pagination-summary">{summary}</div>
      <div className="module-pagination-controls">
        <button className="pagination-button muted">Prev</button>
        <button className="pagination-button active">1</button>
        <button className="pagination-button">2</button>
        <button className="pagination-button">3</button>
        <button className="pagination-button">4</button>
        <button className="pagination-button">5</button>
        <button className="pagination-button">Next</button>
      </div>
    </div>
  );
}

export default ModulePagination;
