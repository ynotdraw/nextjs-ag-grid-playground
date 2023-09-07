"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import * as React from "react";

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

const Table = ({}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      // NOTE: This could stop working at any moment, so we shouldn't be
      //       **too** reliant on it.  Check out `products-data.json`
      //       if this stops working.
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        throw Error("An error was returned from the API.");
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
    { field: "id", headerName: "ID", width: 60 },
    { field: "title" },
    { field: "description", resizable: true },
    { field: "price" },
    { field: "discountPercentage" },
    { field: "rating" },
    { field: "stock" },
    { field: "brand" },
    { field: "category" },
    { field: "thumbnail", resizable: true },
    { field: "images", resizable: true },
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
