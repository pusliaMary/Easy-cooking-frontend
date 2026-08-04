import { filteredMeal, filteredRecipeBase, type FilterItem } from "@/shared";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./Filters.module.scss";
import { getStyles } from "@/shared/lib/getStyle/getStyle";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { Typography } from "@/shared/ui/Typography";
import { Skeleton } from "@/shared/ui/Skeleton";

export type ProteinType = "meat" | "poultry" | "seafood" | "vegan";
export type CategoryType =
  | "salad"
  | "soup"
  | "garnish"
  | "mainCourse"
  | "dessert"
  | "drink";

export interface IngredientItem {
  name: string;
}

export interface Recipe {
  _id?: string;
  imgSource: string;
  title: string;
  category: CategoryType;
  containsProtein: boolean;
  whatProtein?: ProteinType[];
  containsFiber: boolean;
  ingredients: IngredientItem[];
  steps: string[];
  keyWords: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RenderedRecipe extends Recipe {
  renderKey: string;
}

export interface MealGroup {
  mealValue: string;
  mealLabel: string;
  recipes: RenderedRecipe[];
}

const MEAL_MAP: Record<string, CategoryType[]> = {
  breakfast: ["salad", "soup", "garnish", "mainCourse", "dessert", "drink"],
  supper: ["salad", "soup", "mainCourse"],
  dinner: ["salad", "mainCourse"],
};

const LOCAL_STORAGE_KEY = "easy_cooking_plan";

export const Filters = () => {
  const targetRef = useRef<HTMLDivElement>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [visibleRecipes, setVisibleRecipes] = useState<MealGroup[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing saved plan from localStorage", e);
          return [];
        }
      }
    }
    return [];
  });

  const [chosenMeals, setChosenMeals] = useState<string[]>([]);
  const [chosenBases, setChosenBases] = useState<string[]>([]);

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

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://easy-cooking-back.onrender.com", {
          signal,
        });
        const data: Recipe[] = await response.json();

        if (Array.isArray(data)) {
          setRecipes(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.log("Error fetching recipes", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibleRecipes));
  }, [visibleRecipes]);

  const ClearPlan = useCallback(() => {
    setVisibleRecipes([]);
    setChosenMeals([]);
    setChosenBases([]);
  }, []);

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

    const baseFilteredRecipes = recipes.filter((recipe) => {
      if (!recipe) return false;

      if (lowerBases.length === 0) return true;

      const hasMatchingProtein =
        Array.isArray(recipe.whatProtein) &&
        recipe.whatProtein.some((p) => {
          if (!p) return false;
          return lowerBases.includes(String(p).trim().toLowerCase());
        });

      const hasMatchingKeyWord =
        Array.isArray(recipe.keyWords) &&
        recipe.keyWords.some((w) => {
          if (!w) return false;
          return lowerBases.includes(String(w).trim().toLowerCase());
        });

      return hasMatchingProtein || hasMatchingKeyWord;
    });

    const structuredPlan: MealGroup[] = [];
    const MEAL_ORDER = ["breakfast", "supper", "dinner"];

    MEAL_ORDER.forEach((mealValue) => {
      if (!chosenMeals.includes(mealValue)) return;

      const mealKey = mealValue.toLowerCase().trim();
      const categoriesForThisMeal = MEAL_MAP[mealKey] || [];

      const originalMealInfo = filteredMeal.find((m) => m.value === mealValue);
      const mealLabel = originalMealInfo ? originalMealInfo.label : mealValue;

      const groupRecipes: RenderedRecipe[] = [];

      const localUsedIds = new Set<string>();

      categoriesForThisMeal.forEach((category) => {
        let allowedRecipes = baseFilteredRecipes.filter(
          (r) =>
            r.category &&
            String(r.category).toLowerCase() === category.toLowerCase() &&
            r._id &&
            !localUsedIds.has(r._id),
        );

        if (allowedRecipes.length === 0) {
          allowedRecipes = baseFilteredRecipes.filter(
            (r) =>
              r.category &&
              String(r.category).toLowerCase() === category.toLowerCase(),
          );
        }

        if (allowedRecipes.length > 0) {
          const randomIndex = Math.floor(Math.random() * allowedRecipes.length);
          const chosenRecipe = allowedRecipes[randomIndex];

          if (chosenRecipe._id) {
            localUsedIds.add(chosenRecipe._id);
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
      alert("План не создан! Нет доступных рецептов для выбранных критериев.");
    }

    setVisibleRecipes(structuredPlan);
  }, [recipes, chosenMeals, chosenBases, isLoading]);

  const allIngredientNames = visibleRecipes.flatMap((group) =>
    group.recipes.flatMap((recipe) =>
      recipe.ingredients
        ? recipe.ingredients.map((ing) => ing.name.trim())
        : [],
    ),
  );

  const uniqueIngredients = Array.from(new Set(allIngredientNames));

  const currentProteinBases = chosenBases.map((b) =>
    String(b).trim().toLowerCase(),
  );

  const allPreparationSteps = visibleRecipes
    .flatMap((group) =>
      group.recipes.flatMap((recipe) => {
        if (!recipe.steps || recipe.steps.length === 0) return [];

        const isProteinRecipe = recipe.containsProtein === true;

        return recipe.steps.map((stepText, index) => {
          const lowerStepText = stepText.toLowerCase();

          const stepMentionsProtein = currentProteinBases.some((protein) =>
            lowerStepText.includes(protein),
          );

          return {
            text: stepText,
            isPriority: isProteinRecipe || stepMentionsProtein,
            key: `${recipe._id || recipe.title}-step-${index}-${Math.random()}`,
          };
        });
      }),
    )

    .sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });

  return (
    <Stack direction="column" max>
      <Stack tag="section" justify="around" className={styles.filterSection}>
        <Stack
          direction="column"
          justify="between"
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

          <Stack gap={16}>
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
              <Button variant="secondary" size="sm" onClick={ClearPlan}>
                Clear plan
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction="column"
        align="center"
        gap={32}
        style={{ marginTop: "200px" }}
      >
        {isLoading && (
          <Stack
            direction="column"
            align="center"
            gap={24}
            style={{ width: "100%" }}
          >
            <Typography variant="h3" style={{ opacity: 0.6 }}>
              Loading database (Server is waking up, please wait)...
            </Typography>

            {[1, 2].map((groupKey) => (
              <Stack
                direction="column"
                align="center"
                gap={16}
                key={`group-skeleton-${groupKey}`}
                style={{ width: "100%" }}
              >
                <Skeleton width={180} height={28} />

                <Stack
                  justify="around"
                  gap={16}
                  style={{ flexWrap: "wrap", width: "100%" }}
                >
                  {[1, 2, 3].map((cardKey) => (
                    <Stack
                      direction="column"
                      gap={8}
                      key={`card-skeleton-${groupKey}-${cardKey}`}
                    >
                      <Skeleton width={260} height={180} />
                      <Skeleton width={200} height={20} />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {!isLoading && visibleRecipes.length > 0 && (
          <Typography variant="h1">Here is your plan</Typography>
        )}

        {!isLoading &&
          visibleRecipes.map((group: MealGroup) => (
            <Stack
              direction="column"
              align="center"
              gap={16}
              key={group.mealValue}
              max
            >
              <Typography variant="h3">{group.mealLabel}</Typography>

              <Stack justify="around" gap={16} max wrap>
                {group.recipes.map((recipe: RenderedRecipe) => (
                  <RecipeCard
                    title={recipe.title}
                    img={recipe.imgSource}
                    key={recipe.renderKey}
                  />
                ))}
              </Stack>
            </Stack>
          ))}

        {!isLoading && uniqueIngredients.length > 0 && (
          <Stack
            direction="column"
            align="start"
            gap={16}
            style={{
              width: "100%",
              marginTop: "40px",
              padding: "24px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h2">Shopping list</Typography>

            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px",
                width: "100%",
                paddingLeft: "20px",
              }}
            >
              {uniqueIngredients.map((ingredientName, index) => (
                <li
                  key={`${ingredientName}-${index}`}
                  style={{ listStyleType: "disc", fontSize: "16px" }}
                >
                  {ingredientName}
                </li>
              ))}
            </ul>
          </Stack>
        )}

        {!isLoading && allPreparationSteps.length > 0 && (
          <Stack
            direction="column"
            align="start"
            gap={16}
            style={{
              width: "100%",
              marginTop: "40px",
              padding: "24px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h2">Cooking plan step-by-step</Typography>

            <ul
              style={{
                width: "100%",
                paddingLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {allPreparationSteps.map((step) => (
                <li
                  key={step.key}
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.5",
                    fontWeight: step.isPriority ? "500" : "normal",
                  }}
                >
                  {step.text}
                </li>
              ))}
            </ul>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
