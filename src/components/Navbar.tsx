import React, { useState } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { useCreate, useList } from "@refinedev/core";
import { resources } from "utility";
import { IRecipe } from "src/interfaces";
import IconButton from "@mui/material/IconButton";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useThemeContext } from "src/context/ThemeContext";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchAppBar: React.FC = () => {
  const [sourceUrl, setSourceUrl] = useState("");
  const { data } = useList<IRecipe>({
    resource: resources.recipes,
    filters: [
      {
        field: "isSubtitlesProcessed",
        operator: "eq",
        value: false,
      },
    ],
  });
  const { toggleTheme } = useThemeContext();
  const theme = useTheme();

  const { mutate: createRecipe } = useCreate<IRecipe>();

  const handleAddRecipe = () => {
    const existingRecipe = data?.data.find(
      (recipe) => recipe.sourceUrl === sourceUrl
    );

    if (!existingRecipe && resources.recipes) {
      createRecipe({
        resource: resources.recipes,
        values: {
          sourceUrl,
          isSubtitlesProcessed: false,
          title: "New Recipe", // Add other necessary fields with default values
          rawSubtitles: "",
          modelUsed: "Openhermes",
          enSubtitles: "",
          ingredients: "",
          instructions: "",
          sourceLanguage: "",
          image: "",
          markdownData: "",
          chefTips: "",
          culture: "",
          totalTimeMinutes: 0,
          isGlutenFree: false,
          isVegan: false,
          isLactoseFree: false,
          isVegetarian: false,
          isKosher: false,
          isKeto: false,
          isLowCarb: false,
          isDairyFree: false,
          isNeedsReview: false,
          score: 0,
        },
      });
    }
    setSourceUrl("");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "dark" ? (
              <BrightnessHighIcon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Munch Recipes
          </Typography>

          <Search>
            <StyledInputBase
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Add URL"
              inputProps={{ "aria-label": "submit" }}
            />
          </Search>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddRecipe}
          >
            Submit
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SearchAppBar;
