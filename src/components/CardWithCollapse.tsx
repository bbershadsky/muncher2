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
    title?: string;
    image?: string;
    instructions?: string;
    ingredients?: string;
    sourceUrl?: string;
  };
}

const CardWithCollapse: React.FC<CardWithCollapseProps> = ({ recipe }) => {
  const [expanded, setExpanded] = useState(false);

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  const youtubeEmbedUrl =
    recipe.sourceUrl && isYouTubeUrl(recipe.sourceUrl)
      ? getYouTubeEmbedUrl(recipe.sourceUrl)
      : null;

  return (
    <Card>
      {recipe.image && (
        <CardMedia
          component="img"
          image={recipe.image}
          alt={recipe.title}
          className="bs-[185px]"
        />
      )}
      <CardContent>
        {recipe.title && (
          <Typography variant="h5" className="mbe-3">
            {recipe.title}
          </Typography>
        )}
        {recipe.instructions && <Typography>{recipe.instructions}</Typography>}
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
          {recipe.ingredients && (
            <>
              <Typography variant="h6">Ingredients</Typography>
              <Typography>{recipe.ingredients}</Typography>
            </>
          )}
          {recipe.instructions && (
            <>
              <Typography variant="h6">Instructions</Typography>
              <Typography>{recipe.instructions}</Typography>
            </>
          )}
          {youtubeEmbedUrl && (
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CardWithCollapse;
