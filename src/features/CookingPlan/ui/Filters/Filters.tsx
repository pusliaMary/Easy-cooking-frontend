import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { getStyles } from "@/shared/lib";
import styles from "./Filters.module.scss";
import { filteredMeal, filteredRecipeBase, type FilterItem } from "@/shared/lib";

import { useRef, useState, useCallback } from "react";
import type {
  Recipe,
  MealGroup,
  ProteinType,
  CategoryType,
  RenderedRecipe,
} from "@/entities/recipes";

interface FiltersProps {
  fetchedRecipes: Recipe[];
  isLoading: boolean;
  visibleRecipes: MealGroup[];
  chosenBases: string[];
  setChosenBases: Dispatch<SetStateAction<string[]>>;
  setVisibleRecipes: Dispatch<SetStateAction<MealGroup[]>>;
  setPurchasedItems: Dispatch<SetStateAction<string[]>>;
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
}

const MEAL_MAP: Record<string, CategoryType[]> = {
  breakfast: ["salad", "soup", "garnish", "main Course", "dessert", "drink"],
  supper: ["salad", "soup", "main Course", "dessert", "drink"],
  dinner: ["salad", "main Course", "dessert"],
};

export const Filters = ({
  fetchedRecipes,
  isLoading,
  visibleRecipes,
  chosenBases,
  setChosenBases,
  setVisibleRecipes,
  setPurchasedItems,
  setCompletedSteps,
}: FiltersProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [chosenMeals, setChosenMeals] = useState<string[]>([]);

  const toggleMeal = (value: string) => {
    setChosenMeals((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleBase = (value: string) => {
    setChosenBases((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const CreatePlan = useCallback(() => {
    if (isLoading) return;

    if (chosenMeals.length === 0) {
      alert("Please select at least one meal. Meal-bases are optional.");
      setVisibleRecipes([]);
      return;
    }

    const lowerBases = chosenBases
      .filter(Boolean)
      .map((b) => String(b).trim().toLowerCase());

    // 1. Первичная фильтрация по белкам / ключевым словам
    const baseFilteredRecipes = fetchedRecipes.filter((recipe: Recipe) => {
      if (!recipe) return false;

      // ОБНОВЛЕНИЕ: Напитки и десерты добавляются независимо от выбранной основы (мясо, веган и т.д.)
      const isDrinkOrDessert = 
        recipe.category === "drink" || 
        recipe.category === "dessert";
        
      if (isDrinkOrDessert) return true;

      // Для остальных категорий (основные блюда, супы и т.д.) применяется стандартный фильтр
      if (lowerBases.length === 0) return true;

      const hasMatchingProtein =
        Array.isArray(recipe.whatProtein) &&
        recipe.whatProtein.some((p: ProteinType) => {
          if (!p) return false;
          return lowerBases.includes(String(p).trim().toLowerCase());
        });

      const hasMatchingKeyWord =
        Array.isArray(recipe.keyWords) &&
        recipe.keyWords.some((w: string) => {
          if (!w) return false;
          return lowerBases.includes(String(w).trim().toLowerCase());
        });

      return hasMatchingProtein || hasMatchingKeyWord;
    });

    const structuredPlan: MealGroup[] = [];
    const MEAL_ORDER = ["breakfast", "supper", "dinner"];
    const globalUsedIds = new Set<string>();

    MEAL_ORDER.forEach((mealValue) => {
      if (!chosenMeals.includes(mealValue)) return;

      const mealKey = mealValue.toLowerCase().trim();
      const categoriesForThisMeal = MEAL_MAP[mealKey] || [];
      const originalMealInfo = filteredMeal.find((m) => m.value === mealValue);
      const mealLabel = originalMealInfo ? originalMealInfo.label : mealValue;

      const groupRecipes: RenderedRecipe[] = [];

      categoriesForThisMeal.forEach((category) => {
        const allowedRecipes = baseFilteredRecipes.filter(
          (r: Recipe) =>
            r.category &&
            String(r.category).toLowerCase() === category.toLowerCase() &&
            r._id &&
            !globalUsedIds.has(String(r._id)),
        );

        if (allowedRecipes.length > 0) {
          const randomIndex = Math.floor(Math.random() * allowedRecipes.length);
          const chosenRecipe = allowedRecipes[randomIndex];

          if (chosenRecipe._id) {
            globalUsedIds.add(String(chosenRecipe._id));
          }

          const uniqueId =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2, 9);

          groupRecipes.push({
            ...chosenRecipe,
            renderKey: `${mealValue}-${chosenRecipe._id || "recipe"}-${uniqueId}`,
          });
        }
      });

      if (groupRecipes.length > 0) {
        structuredPlan.push({
          mealValue,
          mealLabel,
          recipes: groupRecipes,
        });
      }
    });

    if (structuredPlan.length === 0) {
      alert("План не создан! Нет доступных уникальных рецептов для выбранных критериев.");
      setVisibleRecipes([]);
      return;
    }

    setCompletedSteps([]);
    setPurchasedItems([]);
    setVisibleRecipes(structuredPlan);
  }, [fetchedRecipes, chosenMeals, chosenBases, isLoading, setVisibleRecipes, setCompletedSteps, setPurchasedItems]);

  const ClearPlan = useCallback(() => {
    setVisibleRecipes([]);
    setChosenMeals([]);
    setChosenBases([]);
    setPurchasedItems([]);
    setCompletedSteps([]);
  }, [setChosenBases, setCompletedSteps, setPurchasedItems, setVisibleRecipes]);

  return (
    <Stack tag="section" justify="around" className={styles.filterSection} max>
      <Stack
        direction="column"
        justify="between"
        align="center"
        ref={targetRef}
        className={getStyles(styles.filtersImgBtn, {}, [])}
      >
        {filteredMeal.map(({ label, value }: FilterItem) => {
          const isSelected = chosenMeals.includes(value);
          return (
            <Button
              key={value}
              className={`${styles.mealButton} ${isSelected ? styles.active : ""}`}
              size="sm"
              onClick={() => toggleMeal(value)}
              disabled={isLoading}
            >
              {label.toUpperCase()}
            </Button>
          );
        })}
      </Stack>

      <Stack direction="column" justify="between" align="center" gap={16}>
        <Stack
          justify="between"
          align="start"
          className={getStyles(styles.filtersImgBtn, {}, [])}
          gap={8}
        >
          {filteredRecipeBase.map(({ label, value }: FilterItem) => {
            const isSelected = chosenBases.includes(value);
            return (
              <Button
                key={value}
                className={`${styles.filterBaseButton} ${isSelected ? styles.active : ""}`}
                onClick={() => toggleBase(value)}
                disabled={isLoading}
              >
                {label}
              </Button>
            );
          })}
        </Stack>

        <div className={styles.actionButtonsGroup}>
          <Button
            className={styles.primaryButton}
            variant="primary"
            size="sm"
            onClick={CreatePlan}
            disabled={isLoading}
          >
            {isLoading
              ? "Connecting to server..."
              : visibleRecipes.length > 0
                ? "Recreate your plan"
                : "Get your recipes"}
          </Button>

          {visibleRecipes.length > 0 && (
            <Button 
              className={styles.secondaryButton} 
              variant="secondary" 
              size="sm" 
              onClick={ClearPlan}
            >
              Clear plan
            </Button>
          )}
        </div>
      </Stack>
    </Stack>
  );
};
