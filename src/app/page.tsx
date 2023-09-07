"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import * as React from "react";

const Table = ({}) => {
  const [rowData] = React.useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const [columnDefs] = React.useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  return <AgGridReact rowData={rowData} columnDefs={columnDefs} />;
};

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="mx-auto p-4 h-full w-full">
        <div className="ag-theme-alpine h-96 w-full">
          <Table />
        </div>
      </div>
    </div>
  );
}
