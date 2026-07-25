import { Stack } from "@/shared/ui/Stack/Stack";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { useEffect, useState } from "react";
// import { Filters } from "@/features/AdminAuth/ui/Filters/ui/Filters";

interface Recipe {
  _id: string;
  imgSource: string;
  title: string;
}

export const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "https://easy-cooking-backend.onrender.com",
          { signal },
        );
        const data: Recipe[] = await response.json();

        setRecipes(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.log("Error fetching recipes", error);
      }
    };

    fetchRecipes();
    return () => {
      controller.abort();
    };
  }, []);

  console.log(recipes);

  // if (isLoading) {
  //     return <div>Загрузка рецептов...</div>;
  // }

  return (
    <Stack>
      {/* <Filters /> */}
      {recipes.map((recipe) => (
        <RecipeCard
          img={recipe.imgSource}
          title={recipe.title}
          key={recipe._id}
        />
      ))}
    </Stack>
  );
};
