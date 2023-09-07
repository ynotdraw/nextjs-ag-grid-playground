"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams, ITooltipParams } from "ag-grid-community";
import * as React from "react";

import productsFromJson from "../products-data.json";

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
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        ></path>
      </svg>
      Buy now
    </button>
  );
};

const DescriptionTooltip = (props: ITooltipParams) => {
  const data = props.data.description;

  return <div className="bg-slate-600 text-white rounded-md p-2">{data}</div>;
};

const Table = ({}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      // NOTE: This could stop working at any moment, so we shouldn't be
      //       **too** reliant on it.  Check out `products-data.json`
      //       if this stops working.
      //       Could also use https://www.ag-grid.com/example-assets/small-olympic-winners.json instead
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        console.error("The API request failed, falling back to static JSON");
        setProducts(productsFromJson.products);
        setIsLoading(false);
        return;
      }

      const results: ProductsResponse = await response.json();

      setProducts(results?.products);

      setIsLoading(false);
    }

    fetchData();

    return () => {
      setIsLoading(false);
      setProducts(null);
    };
  }, []);

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

  return <AgGridReact rowData={products} columnDefs={columnDefs} />;
};

export default function Home() {
  return (
    <div className="ag-theme-alpine h-96 w-full mx-auto p-4">
      <Table />
    </div>
  );
}
