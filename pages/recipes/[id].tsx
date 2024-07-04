import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";
import { appwriteClient, resources } from "utility";
import { IRecipe } from "src/interfaces";
import { useList } from "@refinedev/core";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface RecipePageProps {
  id: string;
}

const RecipePage: React.FC<RecipePageProps> = ({ id }) => {
  const router = useRouter();

  const concat_id = "https://youtu.be/" + id;

  const { data, isLoading, error } = useList<IRecipe>({
    resource: resources.recipes,
    filters: [{ field: "sourceUrl", operator: "eq", value: concat_id }],
    pagination: { current: 1, pageSize: 10 },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading recipe: {error.message}</div>;
  }

  const recipe = data?.data?.[0];

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleOpenInNewTab = () => {
    window.open(recipe.sourceUrl, "_blank");
  };

  return (
    <Card>
      {recipe.image && (
        <CardMedia component="img" image={recipe.image} alt={recipe.title} />
      )}
      <CardContent>
        <Button onClick={handleBackClick}>Back</Button>
        <Typography variant="h5">{recipe.title}</Typography>
        <Typography variant="h6">Ingredients</Typography>
        <Typography>{recipe.ingredients.join(", ")}</Typography>
        <Typography variant="h6">Instructions</Typography>
        <Typography>{recipe.instructions.join(", ")}</Typography>
        {recipe.sourceUrl && (
          <div>
            <iframe
              width="560"
              height="315"
              src={recipe.sourceUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleOpenInNewTab}
            ></iframe>
            <IconButton onClick={handleOpenInNewTab}>
              <OpenInNewIcon />
            </IconButton>
            <Typography>
              If the video does not load, you can watch it directly on{" "}
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
              .
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  console.log("Fetching recipe with ID:", id);

  return {
    props: { id },
  };
};

export default RecipePage;
