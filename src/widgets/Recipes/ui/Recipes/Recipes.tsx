import { Stack } from "@/shared/ui/Stack/Stack";
import { RecipeCard } from "../RecipeCard/RecipeCard";

interface Recipe {
  id: number;
  img: string;
  title: string;
}

const recipes: Recipe[] = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1784035063903-1fd61fabef58?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "city",
  },
  {
    id: 2,
    img: "https://plus.unsplash.com/premium_photo-1784206737001-43b4a89e1627?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "forest",
  },
];

export const Recipes = () => {
  return (
    <Stack>
      {recipes.map((recipe) => {
        return (
          <RecipeCard img={recipe.img} title={recipe.title} key={recipe.id} />
        );
      })}

      {/*INGREDIENTS. overall list */}
      {/* cooking sequence */}
    </Stack>
  );
};
