import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Stack } from "@/shared/ui/Stack";
import { Typography } from "@/shared/ui/Typography";
import styles from "./Ingredients.module.scss";
import type { MealGroup } from "@/entities/recipes";

interface ingredientsProps {
  isLoading: boolean;
  isError: boolean;
  visibleRecipes: MealGroup[];
  purchasedItems: string[];
  setPurchasedItems: Dispatch<SetStateAction<string[]>>;
}

export const Ingredients = ({ isLoading, isError, visibleRecipes, setPurchasedItems, purchasedItems }: ingredientsProps) => {
  const togglePurchased = (name: string) => {
    setPurchasedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  // Оптимизация через useMemo — вычисляется только при изменении visibleRecipes
  const uniqueIngredients = useMemo(() => {
    const allIngredientNames = visibleRecipes.flatMap((group) =>
      group.recipes.flatMap((recipe) =>
        recipe.ingredients ? recipe.ingredients.map((ing) => ing.name.trim()) : []
      )
    );
    return Array.from(new Set(allIngredientNames));
  }, [visibleRecipes]);

  if (isLoading || isError || uniqueIngredients.length === 0) return null;

  return (
    <Stack direction="column" align="start" gap={16} max className={styles.ingredientsSection}>
      <Typography variant="h2">Shopping list</Typography>
      <ul className={styles.ingredientsList}>
        {uniqueIngredients.map((ingredientName) => {
          const isChecked = purchasedItems?.includes(ingredientName);
          return (
            <li
              key={ingredientName}
              className={`${styles.ingredientsItem} ${isChecked ? styles.checked : ""}`}
              onClick={() => togglePurchased(ingredientName)}
            >
              {ingredientName}
            </li>
          );
        })}
      </ul>
    </Stack>
  );
};
