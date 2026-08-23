import { useState, useEffect } from "react";
import { Filters } from "../Filters/Filters";
import { Ingredients } from "../Ingredients/Ingredients";
import { CookingSteps } from "../CookingSteps/CookingSteps";
import { Stack } from "@/shared/ui/Stack";
import { Typography } from "@/shared/ui/Typography";
import { Skeleton } from "@/shared/ui/Skeleton";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { useGetRecipesQuery } from "@/entities/recipes";
import type { Recipe, MealGroup, RenderedRecipe } from "@/entities/recipes";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import styles from "./CookingPlan.module.scss";

const LOCAL_STORAGE_KEY = "easy_cooking_plan";
const LOCAL_STORAGE_INGREDIENTS_KEY = "easy_cooking_purchased_ingredients";
const LOCAL_STORAGE_STEPS_KEY = "easy_cooking_completed_steps";

function isErrorWithMessage(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as Record<string, unknown>).message === "string"
  );
}

const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return "Unknown error";
  if ("data" in error && error.data && isErrorWithMessage(error.data)) {
    return error.data.message;
  }
  if ("message" in error && error.message) return error.message;
  return "Failed to load database. Please try again later.";
};

export const CookingPlan = () => {
  const [chosenBases, setChosenBases] = useState<string[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [visibleRecipes, setVisibleRecipes] = useState<MealGroup[]>([]);

  const { data, isLoading: isFetchLoading, isError: isFetchError, error: fetchError } = useGetRecipesQuery({});
  const fetchedRecipes: Recipe[] = data ?? [];

  useEffect(() => {
    const savedPlan = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedIngredients = localStorage.getItem(LOCAL_STORAGE_INGREDIENTS_KEY);
    const savedSteps = localStorage.getItem(LOCAL_STORAGE_STEPS_KEY);

    if (savedPlan) {
      try { setVisibleRecipes(JSON.parse(savedPlan)); } catch (e) { console.error(e); }
    }
    if (savedIngredients) {
      try { setPurchasedItems(JSON.parse(savedIngredients)); } catch (e) { console.error(e); }
    }
    if (savedSteps) {
      try { setCompletedSteps(JSON.parse(savedSteps)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (visibleRecipes.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleRecipes));
    }
  }, [visibleRecipes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_INGREDIENTS_KEY, JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STEPS_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  return (
    
    <Stack direction="column" max justify="center" className={styles.cookingPlanWrapper}>
      {/* Компонент фильтров теперь самодостаточен и содержит свой заголовок внутри */}
      <Filters
        fetchedRecipes={fetchedRecipes}
        isLoading={isFetchLoading}
        visibleRecipes={visibleRecipes}
        chosenBases={chosenBases}
        setChosenBases={setChosenBases}
        setVisibleRecipes={setVisibleRecipes}
        setPurchasedItems={setPurchasedItems}
        setCompletedSteps={setCompletedSteps}
      />
      
      <Stack direction="column" align="center" gap={32} className={styles.contentContainer}>
        {isFetchError && (
          <Stack direction="column" align="center" gap={24} className={styles.fetchError}>
            <Typography variant="h2" style={{ color: "#c53030" }}>Something went wrong</Typography>
            <Typography variant="h3">{getErrorMessage(fetchError)}</Typography>
            {fetchError && "status" in fetchError && (
              <Typography>Status code: {fetchError.status}</Typography>
            )}
          </Stack>
        )}

        {isFetchLoading && !isFetchError && (
          <Stack direction="column" align="center" gap={24} max>
            <Typography variant="h3">Loading database (Server is waking up, please wait)...</Typography>
            {[1, 2].map((groupKey) => (
              <Stack direction="column" align="center" gap={16} key={`group-skeleton-${groupKey}`} max>
                <Skeleton width={180} height={28} />
                <Stack justify="around" gap={16} wrap max>
                  {[1, 2, 3].map((cardKey) => (
                    <Stack direction="column" gap={8} key={`card-skeleton-${groupKey}-${cardKey}`}>
                      <Skeleton width={260} height={180} />
                      <Skeleton width={200} height={20} />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {!isFetchLoading && !isFetchError && visibleRecipes.length > 0 && (
          <Typography variant="h1" className={styles.planTitle}>Here is your plan</Typography>
        )}

        {!isFetchLoading && !isFetchError && visibleRecipes.map((group: MealGroup) => (
          <Stack direction="column" align="center" gap={16} key={group.mealValue} max>
            <Typography  className={styles.mealLabel}>{group.mealLabel}</Typography>
            {/* Отрендерим карточки через нашу крутую CSS-сетку, чтобы они не скакали */}
            <div className={styles.recipesGrid}>
              {group.recipes.map((recipe: RenderedRecipe) => (
                <RecipeCard title={recipe.title} img={recipe.imgSource} key={recipe.renderKey} />
              ))}
            </div>
          </Stack>
        ))}

        <Ingredients
          isLoading={isFetchLoading}
          isError={isFetchError}
          visibleRecipes={visibleRecipes}
          purchasedItems={purchasedItems}
          setPurchasedItems={setPurchasedItems}
        />

        <CookingSteps
          visibleRecipes={visibleRecipes}
          chosenBases={chosenBases}
          completedSteps={completedSteps}
          isLoading={isFetchLoading}
          isError={isFetchError}
          setCompletedSteps={setCompletedSteps}
        />
      </Stack>
    </Stack>
  );
};
