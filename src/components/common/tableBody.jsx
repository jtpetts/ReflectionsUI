import React from "react";
import _ from "lodash";

function TableBody(props) {
  const renderCell = (item, column) => {
    if (column.content) return column.content(item);
    else return _.get(item, column.path);
  };

  const createCellKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  const { data, columns } = props;

  return (
    <tbody>
      {data.map(item => (
        <tr key={item._id}>
          {columns.map(column => (
            <td key={createCellKey(item, column)}>
              {renderCell(item, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
