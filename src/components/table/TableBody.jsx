function TableBody({ columns, rows, renderRow }) {
  return <tbody>{rows.map((row, index) => renderRow(row, index, columns))}</tbody>;
}

export default TableBody;
