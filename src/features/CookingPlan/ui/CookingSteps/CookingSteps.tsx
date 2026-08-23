import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Stack } from "@/shared/ui/Stack";
import { Typography } from "@/shared/ui/Typography";
import type { MealGroup } from "@/entities/recipes";
import styles from "./CookingSteps.module.scss";

interface stepsProps {
  isLoading: boolean;
  isError: boolean;
  visibleRecipes: MealGroup[];
  chosenBases: string[];
  completedSteps: string[];
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
}

export const CookingSteps = ({
  visibleRecipes,
  chosenBases,
  completedSteps,
  isLoading,
  isError,
  setCompletedSteps,
}: stepsProps) => {
  const toggleStepCompleted = (stepKey: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepKey) ? prev.filter((key) => key !== stepKey) : [...prev, stepKey]
    );
  };

  // Группируем шаги ОТНОСИТЕЛЬНО КАЖДОГО БЛЮДА
  const recipesWithSteps = useMemo(() => {
    const currentProteinBases = chosenBases.map((b) => String(b).trim().toLowerCase());

    // Собираем все уникальные рецепты, у которых есть шаги
    const allRecipes = visibleRecipes.flatMap((group) => group.recipes);
    
    // Исключаем дубликаты рецептов, если они попали в разные приемы пищи
    const uniqueRecipes = allRecipes.filter(
      (recipe, index, self) => self.findIndex((r) => r.renderKey === recipe.renderKey) === index
    );

    return uniqueRecipes.map((recipe) => {
      const isProteinRecipe = recipe.containsProtein === true;
      const recipeSlug = recipe._id || recipe.title.replace(/\s+/g, "-");

      const steps = (recipe.steps || []).map((stepText, index) => {
        const lowerStepText = stepText.toLowerCase();
        const stepMentionsProtein = currentProteinBases.some((protein) =>
          lowerStepText.includes(protein)
        );
        const key = `${recipeSlug}-step-${index}`;

        return {
          key,
          text: stepText, // Берем только чистый текст шага (без повторения названия блюда!)
          index: index + 1,
          isPriority: isProteinRecipe || stepMentionsProtein,
          isDone: completedSteps.includes(key),
        };
      });

      // Считаем, сколько шагов в этом блюде уже выполнено
      const doneCount = steps.filter((s) => s.isDone).length;
      const isRecipeFullyDone = steps.length > 0 && doneCount === steps.length;

      return {
        title: recipe.title,
        id: recipeSlug,
        steps,
        isRecipeFullyDone, // Флаг: приготовлено ли блюдо полностью
      };
    }).filter(recipe => recipe.steps.length > 0); // Показываем только те, где есть шаги
  }, [visibleRecipes, chosenBases, completedSteps]);

  if (isLoading || isError || recipesWithSteps.length === 0) return null;

  return (
    <Stack direction="column" align="start" gap={24} className={styles.cookingSection}>
      <Typography variant="h2">Cooking plan step-by-step</Typography>
      
      <div className={styles.recipesContainer}>
        {recipesWithSteps.map((recipe) => (
          /* Блок одного конкретного блюда */
          <div 
            key={recipe.id} 
            className={`${styles.recipeBlock} ${recipe.isRecipeFullyDone ? styles.recipeBlockDone : ""}`}
          >
            <h3 className={styles.recipeTitle}>
              {recipe.title}
              {recipe.isRecipeFullyDone && <span className={styles.doneBadge}>Готово!</span>}
            </h3>

            <ol className={styles.cookingList}>
              {recipe.steps.map((step) => (
                <li
                  key={step.key}
                  className={`${styles.cookingItem} ${step.isPriority ? styles.priorityStep : ""} ${step.isDone ? styles.cookingItemDone : ""}`}
                  onClick={() => toggleStepCompleted(step.key)}
                >
                  <span className={styles.stepNumber}>Шаг {step.index}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Stack>
  );
};
