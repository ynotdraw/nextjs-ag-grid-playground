"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  ITooltipParams,
  IServerSideGetRowsParams,
} from "ag-grid-enterprise";
import * as React from "react";

import productsFromJson from "../products-data.json";

/**
 * Custom sort function.  Normally the backend would do this for us,
 * but we'll simulate that here.
 */
const sortProducts = ({
  products,
  key,
  direction,
}: {
  products: ProductsResponse["products"];
  key: keyof Product;
  direction: "asc" | "desc";
}) => {
  if (direction === "asc") {
    return [...products].sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }

  return [...products].sort((a, b) => (a[key] > b[key] ? -1 : 1));
};

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: Array<string>;
}

interface ProductsResponse {
  products: Array<Product>;
}

/**
 * Renders a "Buy now" button in  the last column. This is mostly testing how easy it is to
 * add a custom cell renderer with AG Grid.
 */
const BuyNowCell = (props: ICellRendererParams) => {
  return (
    <button
      className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 flex items-center gap-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
      onClick={() => {
        alert(
          `You selected "${
            props.data?.title
          }" to purchase for ${Intl.NumberFormat("us", {
            style: "currency",
            currency: "USD",
          }).format(props.data?.price)}`
        );
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        stroke="currentColor"
        viewBox="0 0 24 24"
        data-icon="SvgShoppingCart"
        aria-hidden="true"
        className="w-4 h-4"
      >
        <path
          d="M20.112 19.4a1.629 1.629 0 11-1.629-1.629 1.63 1.63 0 011.629 1.629zM9.941 17.768a1.629 1.629 0 101.628 1.632 1.629 1.629 0 00-1.628-1.632zM3 3.006h1.678a2.113 2.113 0 011.965 1.573l2.051 9.152a2.114 2.114 0 001.965 1.574h6.788a2.153 2.153 0 001.989-1.568L20.957 8.8a1.233 1.233 0 00-1.236-1.588L11.4 7.064"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></path>
      </svg>
      Buy now
    </button>
  );
};

/**
 * Renders a custom tooltip for the Description column. I wanted to see how easy it was
 * to render custom tooltip components.
 */
const DescriptionTooltip = (props: ITooltipParams) => {
  const data = props.data.description;

  return <div className="bg-slate-600 text-white rounded-md p-2">{data}</div>;
};

/**
 * A table component utilizing AG Grid.  The component will fetch data and render
 * the results.
 */
const Table = ({}) => {
  const [columnDefs] = React.useState<ColDef[]>([
    { field: "id", headerName: "ID", width: 100, sortable: true, sort: "asc" },
    { field: "title", sortable: true },
    {
      field: "description",
      resizable: true,
      tooltipField: "description",
      tooltipComponent: DescriptionTooltip,
    },
    { field: "price", sortable: true },
    { field: "discountPercentage" },
    { field: "rating", sortable: true },
    { field: "stock", sortable: true },
    { field: "brand", sortable: true },
    { field: "category", sortable: true },
    { field: "thumbnail", resizable: true },
    { field: "images", resizable: true },
    {
      field: "buyNow",
      cellRenderer: BuyNowCell,
      cellClass: "py-2",
      width: 125,
    },
  ]);

  return (
    <AgGridReact
      columnDefs={columnDefs}
      rowModelType="serverSide"
      serverSideDatasource={{
        getRows: async (params: IServerSideGetRowsParams) => {
          // For now, let's only sort by one column
          const sortDirection = params?.request?.sortModel?.[0]?.sort;
          const sortColumn = params?.request?.sortModel?.[0]?.colId;

          // NOTE: This could stop working at any moment, so we shouldn't be
          //       **too** reliant on it.  Check out `products-data.json`
          //       if this stops working.
          //       Could also use https://www.ag-grid.com/example-assets/small-olympic-winners.json instead
          const response = await fetch("https://dummyjson.com/products");

          const results: ProductsResponse = response.ok
            ? await response.json()
            : productsFromJson;

          // Add an artifical sleep to simulate the backend doing any sorting
          await new Promise((r) => setTimeout(r, 500));

          const sorted =
            sortDirection && sortColumn
              ? sortProducts({
                  products: results.products,
                  key: sortColumn as keyof Product,
                  direction: sortDirection,
                })
              : results.products;

          params.success({ rowData: sorted });
        },
      }}
    />
  );
};

/**
 * Home / default route.
 */
export default function Home() {
  return (
    <div className="ag-theme-alpine h-96 w-full max-w-7xl mx-auto p-4">
      <Table />
    </div>
  );
}
