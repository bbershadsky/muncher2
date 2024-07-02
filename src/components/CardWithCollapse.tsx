"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Link from "next/link";

interface Recipe {
  id: number;
  title?: string;
  image?: string;
  instructions?: string;
  ingredients?: string;
  sourceUrl?: string;
}

interface CardWithCollapseProps {
  recipe: Recipe;
}

const CardWithCollapse: React.FC<CardWithCollapseProps> = ({ recipe }) => {
  const [expanded, setExpanded] = useState(false);
  const slug = encodeURIComponent(recipe.title || "");

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

  const handleFullscreen = () => {
    if (youtubeEmbedUrl) {
      window.open(youtubeEmbedUrl, "_blank");
    }
  };

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
        <Button onClick={() => setExpanded(!expanded)}>See More</Button>
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
                width="100%"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <IconButton onClick={handleFullscreen}>
                <FullscreenIcon />
              </IconButton>
              <Link href={`/recipes/${slug}`} passHref>
                <IconButton>
                  <Button>Recipe Details</Button>
                </IconButton>
              </Link>
            </div>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CardWithCollapse;
