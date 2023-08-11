// TableSection.js

import React from 'react';
import { TableCell, TableRow } from '@mui/material';

const TableSection = ({ filteredData }) => {
  let lastRenderedDate = null;

  return (
    <tbody>
      {filteredData.map((detail, index) => {
        const currentDate = new Date(detail.date).toLocaleDateString();
        const renderDateCell = lastRenderedDate !== currentDate;
        if (renderDateCell) {
          lastRenderedDate = currentDate;
        }
        return (
          <TableRow key={index}>
            <TableCell>{renderDateCell && currentDate}</TableCell>
            <TableCell>{detail.item}</TableCell>
            <TableCell>{detail.quality}</TableCell>
            <TableCell>{detail.isCash ? 'Cash' : 'Quantity'}</TableCell>
            <TableCell>{detail.amount}</TableCell>
          </TableRow>
        );
      })}
    </tbody>
  );
};

export default TableSection;
