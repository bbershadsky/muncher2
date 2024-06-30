import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";

interface FilterProps {
  onSearch: (search: string) => void;
  onFilterChange: (filters: { [key: string]: boolean }) => void;
}

const FilterComponent: React.FC<FilterProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    isGlutenFree: false,
    isVegan: false,
    isLactoseFree: false,
    isVegetarian: false,
    isKosher: false,
    isKeto: false,
    isLowCarb: false,
    isDairyFree: false,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
    onFilterChange({
      ...filters,
      [name]: checked,
    });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Search"
          value={search}
          onChange={handleSearchChange}
        />
      </Grid>
      {Object.keys(filters).map((key) => (
        <Grid item xs={6} sm={3} key={key}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters[key as keyof typeof filters]}
                onChange={handleFilterChange}
                name={key}
              />
            }
            label={key.replace("is", "")}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FilterComponent;
