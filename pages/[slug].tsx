import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import { appwriteClient, resources } from "utility";
import { IRecipe } from "src/interfaces";
import { Query } from "@refinedev/appwrite";

interface RecipePageProps {
  recipe: IRecipe | null;
}

const RecipePage: React.FC<RecipePageProps> = ({ recipe }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <Card>
      {recipe.image && (
        <CardMedia component="img" image={recipe.image} alt={recipe.title} />
      )}
      <CardContent>
        <Typography variant="h5">{recipe.title}</Typography>
        <Typography variant="h6">Ingredients</Typography>
        <Typography>{recipe.ingredients}</Typography>
        <Typography variant="h6">Instructions</Typography>
        <Typography>{recipe.instructions}</Typography>
        {recipe.sourceUrl && (
          <iframe
            width="560"
            height="315"
            src={recipe.sourceUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </CardContent>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  let recipe: IRecipe | null = null;

  try {
    const response = await appwriteClient.database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      resources.recipes,
      [Query.equal("title", slug)]
    );

    if (response.documents.length > 0) {
      recipe = response.documents[0] as IRecipe;
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
  }

  return {
    props: { recipe },
  };
};

export default RecipePage;
