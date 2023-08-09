import React from "react";
import { useTable, usePagination } from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import styles from "./index.module.css";

const TableComponent = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  return (
    <div>
      <TableContainer className={styles.tableContainer}>
        <Table className={styles.table} {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, index) => (
              <TableRow
                key={index}
                {...headerGroup.getHeaderGroupProps()}
                className={styles.tableHeaderRow}
              >
                {headerGroup.headers.map((column, i) => (
                  <TableCell
                    key={i}
                    {...column.getHeaderProps()}
                    className={styles.tableHeaderCell}
                  >
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          {page.length > 0 ? (
            <TableBody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow
                    key={index}
                    {...row.getRowProps()}
                    className={styles.tableBodyRow}
                  >
                    {row.cells.map((cell, i) => (
                      <TableCell
                        key={i}
                        {...cell.getCellProps()}
                        className={styles.tableBodyCell}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography variant="body1" align="center">
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {data.length > 0 && (
        <div className={styles.pagination}>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Typography variant="body1" component="span">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Typography>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
