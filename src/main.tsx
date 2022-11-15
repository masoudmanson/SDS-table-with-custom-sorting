import React from "react";
import {
  CellBasic,
  CellHeader,
  TableHeader,
  TableRow,
  Table,
  CellHeaderDirection,
  Icon,
  CellComponent,
  Tag,
  ButtonIcon,
} from "czifui";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";

import "./index.css";
import { styled } from "@mui/material";

declare module "@tanstack/table-core" {
  interface SortingFns {
    sortByLength: SortingFn<unknown>;
  }
}

const StyledActionList = styled("ul")`
  display: flex;
  & li {
    margin-right: 8px;

    & .MuiButtonBase-root {
      outline: 0;
    }
  }
`;

function App() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const data = React.useState(() => makeData(20))[0];

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        id: "firstName",
        cell: (info) => info.getValue(),
        header: "First Name",
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: "Last Name",
        sortingFn: "sortByLength",
      },
      {
        accessorKey: "age",
        header: "Age",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "visits",
        header: "Visits",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        id: "status",
        header: "Status",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    sortingFns: {
      sortByLength: (
        rowA: Row<Person>,
        rowB: Row<Person>,
        columnId: string
      ): number => {
        let a = rowA.getValue(columnId).toString().length;
        let b = rowB.getValue(columnId).toString().length;

        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      },
    },
  });

  return (
    <div className="app">
      <h1 className="title">Table with a custom sorting function</h1>
      <p className="description">
        Except for the LastName column, which uses the sortByLength custom
        sorting function defined in the code, other table columns use default
        sorting defined by react-table.
      </p>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                switch (header.id) {
                  case "lastName":
                    return (
                      <CellHeader
                        key={header.id}
                        colSpan={header.colSpan}
                        direction={
                          header.column.getIsSorted()
                            ? (header.column.getIsSorted() as CellHeaderDirection)
                            : null
                        }
                        active={!!header.column.getIsSorted()}
                        onClick={header.column.getToggleSortingHandler()}
                        shouldShowTooltipOnHover
                        tooltipText="This column uses a custom sorting function."
                        tooltipSubtitle="Sorts items based on their length."
                      >
                        {
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) as string
                        }
                      </CellHeader>
                    );
                  default:
                    return (
                      <CellHeader
                        key={header.id}
                        colSpan={header.colSpan}
                        direction={
                          header.column.getIsSorted()
                            ? (header.column.getIsSorted() as CellHeaderDirection)
                            : null
                        }
                        active={!!header.column.getIsSorted()}
                        onClick={header.column.getToggleSortingHandler()}
                        hideSortIcon={header.id === "actions" ? true : false}
                      >
                        {
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) as string
                        }
                      </CellHeader>
                    );
                }
              })}
            </tr>
          ))}
        </TableHeader>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    switch (cell.column.id) {
                      case "firstName":
                        return (
                          <CellBasic
                            key={cell.id}
                            primaryText={
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ) as string
                            }
                            icon={
                              <Icon
                                sdsSize="s"
                                sdsIcon="person"
                                sdsType="static"
                              />
                            }
                            verticalAlign="center"
                            iconVerticalAlign="center"
                            shouldShowTooltipOnHover={false}
                          />
                        );
                      case "status":
                        const tagIndentMap = {
                          single: "beta",
                          relationship: "error",
                          complicated: "warning",
                        };
                        const tagValue = cell.getValue() as string;
                        return (
                          <CellComponent key={cell.id} verticalAlign="center">
                            <Tag
                              label={tagValue}
                              color={tagIndentMap[tagValue]}
                              sdsStyle="rounded"
                              sdsType="secondary"
                            />
                          </CellComponent>
                        );
                      case "createdAt":
                        let dateObject = new Date(cell.getValue() as string);

                        return (
                          <CellBasic
                            key={cell.id}
                            primaryText={dateObject.getFullYear().toString()}
                            secondaryText={dateObject.toLocaleString("en-us", {
                              month: "long",
                              day: "numeric",
                            })}
                            tooltipProps={{
                              title: cell.getValue().toString(),
                              sdsStyle: "dark",
                              leaveDelay: 0,
                              leaveTouchDelay: 0,
                            }}
                            verticalAlign="center"
                            horizontalAlign="left"
                          />
                        );
                      case "actions":
                        return (
                          <CellComponent
                            horizontalAlign="left"
                            verticalAlign="center"
                          >
                            <StyledActionList>
                              <li>
                                <ButtonIcon sdsSize="small" sdsType="secondary">
                                  <Icon
                                    sdsIcon="treeHorizontal"
                                    sdsSize="s"
                                    sdsType="iconButton"
                                  />
                                </ButtonIcon>
                              </li>
                              <li>
                                <ButtonIcon sdsSize="small" sdsType="secondary">
                                  <Icon
                                    sdsIcon="barChartVertical3"
                                    sdsSize="s"
                                    sdsType="iconButton"
                                  />
                                </ButtonIcon>
                              </li>
                              <li>
                                <ButtonIcon
                                  sdsSize="small"
                                  active
                                  sdsType="secondary"
                                >
                                  <Icon
                                    sdsIcon="download"
                                    sdsSize="s"
                                    sdsType="iconButton"
                                  />
                                </ButtonIcon>
                              </li>
                              <li>
                                <ButtonIcon sdsSize="small" sdsType="secondary">
                                  <Icon
                                    sdsIcon="dotsHorizontal"
                                    sdsSize="s"
                                    sdsType="iconButton"
                                  />
                                </ButtonIcon>
                              </li>
                            </StyledActionList>
                          </CellComponent>
                        );
                      default:
                        return (
                          <CellBasic
                            key={cell.id}
                            primaryText={
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ) as string
                            }
                            horizontalAlign={
                              cell.column.id === "progress" ? "center" : "left"
                            }
                            verticalAlign="center"
                            shouldShowTooltipOnHover={false}
                          />
                        );
                    }
                  })}
                </TableRow>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
