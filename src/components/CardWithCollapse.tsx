"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";

interface CardWithCollapseProps {
  recipe: {
    title: string;
    image: string;
    instructions: string;
    ingredients: string;
  };
}

const CardWithCollapse: React.FC<CardWithCollapseProps> = ({ recipe }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardMedia
        component="img"
        image={recipe.image}
        alt={recipe.title}
        className="bs-[185px]"
      />
      <CardContent>
        <Typography variant="h5" className="mbe-3">
          {recipe.title}
        </Typography>
        <Typography>{recipe.instructions}</Typography>
      </CardContent>
      <CardActions className="card-actions-dense justify-between">
        <Button onClick={() => setExpanded(!expanded)}>Details</Button>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <i
            className={expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}
          />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout={300}>
        <Divider />
        <CardContent>
          <Typography variant="h6">Ingredients</Typography>
          <Typography>{recipe.ingredients}</Typography>
          <Typography variant="h6">Instructions</Typography>
          <Typography>{recipe.instructions}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CardWithCollapse;
