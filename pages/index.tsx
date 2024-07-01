import React, { useState, useEffect } from "react";
import type { GetServerSideProps } from "next";
import { type GetListResponse, useTable } from "@refinedev/core";
import { resources } from "utility";
import Grid from "@mui/material/Grid";
import CardWithCollapse from "@components/CardWithCollapse";
import FilterComponent from "@components/FilterComponent";
import { IRecipe } from "src/interfaces";
import Navbar from "@components/Navbar";

type ItemProp = {
  products: GetListResponse<IRecipe>;
};

const ProductList: React.FC = () => {
  const { tableQueryResult } = useTable<IRecipe>({
    resource: resources.recipes,
    pagination: {
      pageSize: 1000,
    },
  });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Update the table query with the new search and filters
  }, [search, filters]);

  const handleSearch = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filters: { [key: string]: boolean }) => {
    setFilters(filters);
  };

  const filteredData = tableQueryResult?.data?.data.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilters = Object.keys(filters).every((key) =>
      filters[key] ? recipe[key as keyof IRecipe] : true
    );
    return matchesSearch && matchesFilters;
  });

  return (
    <>
      <Navbar />
      <FilterComponent
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <Grid container spacing={6}>
        {filteredData?.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <CardWithCollapse recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductList;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: { products: "data" },
  };
};
