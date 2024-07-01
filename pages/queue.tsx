import React, { useState } from "react";
import { useList, useCreate } from "@refinedev/core";
import { resources } from "utility";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IRecipe } from "src/interfaces";

const QueueList: React.FC = () => {
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

  const [sourceUrl, setSourceUrl] = useState("");
  const { mutate: createRecipe } = useCreate<IRecipe>();

  const handleAddRecipe = () => {
    createRecipe({
      resource: resources.recipes || "recipes",
      values: {
        sourceUrl,
        isSubtitlesProcessed: false,
        title: "",
        rawSubtitles: "",
        modelUsed: "openhermes",
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
    setSourceUrl("");
  };

  return (
    <>
      <h1>Unprocessed Videos</h1>
      <TextField
        label="Source URL"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleAddRecipe}>
        Add Recipe
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Source URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>{recipe.id}</TableCell>
                <TableCell>{recipe.title}</TableCell>
                <TableCell>{recipe.sourceUrl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default QueueList;
