import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

function Table(props) {
  const { data, columns, sortColumn, onSort } = props;

  return (
    <table className="table table-sm">
      <TableHeader
        onSort={onSort}
        sortColumn={sortColumn}
        columns={columns}
      />
      <TableBody columns={columns} data={data} />
    </table>
  );
}

export default Table;
