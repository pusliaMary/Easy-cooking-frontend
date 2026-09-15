import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Stack } from "@/shared/ui/Stack/Stack";
import { Typography } from "@/shared/ui/Typography";
import { UploadImage } from "@/shared/ui/UploadImage";
import { categories, proteins } from "@/entities/recipes/model/filters";
import { recipeZodSchema } from "../../lib/recipeZodSchema";
import type { RecipeFormInput } from "../../lib/recipeZodSchema";
import type { Recipe } from "@/entities/recipes";

import styles from "./RecipesForm.module.scss";

interface RecipesFormProps {
  onSuccess: () => void;
  isEdit: boolean;
  isSubmitting: boolean;
  initialData?: Recipe;
  // ИСПРАВЛЕНО: Типизация полностью соответствует RecipeFormInput без 'any'
  onSubmit: (data: RecipeFormInput, resetForm: () => void) => void; 
}

const mapRecipeToFormInput = (recipe: Recipe): Partial<RecipeFormInput> => {
  return {
    category: recipe.category,
    title: recipe.title,
    containsProtein: recipe.containsProtein,
    whatProtein: recipe.whatProtein || [],
    containsFiber: recipe.containsFiber,
    ingredients: recipe.ingredients?.map((ing) => ({ name: ing.name })) || [],
    steps: recipe.steps?.map((step) => ({ name: step })) || [],
    keyWords: recipe.keyWords?.map((word) => ({ name: word })) || [],
    uploadImage: recipe.imgSource 
      ? [{ id: "existing-image", preview: recipe.imgSource }] 
      : [],
  };
};

export const RecipesForm = ({
  onSubmit,
  isSubmitting,
  isEdit,
  initialData,
}: RecipesFormProps) => {
  
  const defaultValues = isEdit && initialData 
    ? mapRecipeToFormInput(initialData) 
    : {
        title: "",
        category: undefined,
        containsProtein: false,
        whatProtein: [],
        containsFiber: false,
        ingredients: [{ name: "" }, { name: "" }, { name: "" }],
        steps: [{ name: "" }, { name: "" }],
        keyWords: [{ name: "" }, { name: "" }],
        uploadImage: [],
      };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipeFormInput>({
    resolver: zodResolver(recipeZodSchema, undefined, { raw: true }),
    defaultValues: defaultValues as RecipeFormInput,
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps",
  });

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: "keyWords",
  });

  const containsProteinWatch = useWatch({ control, name: "containsProtein" });

  const handleLocalSubmit = (data: RecipeFormInput) => {
    onSubmit(data, () => reset());
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className={styles.form}>
      <Stack direction="column" gap={24} align="stretch">
        
        {/* Title Field */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="h3">Recipe Title</Typography>
          <input
            type="text"
            {...register("title")}
            className={errors.title ? styles.inputError : ""}
            disabled={isSubmitting}
            placeholder="Enter recipe title"
          />
          {errors.title && (
            <Typography as="span" className={styles.error}>
              ⚠️ {errors.title.message}
            </Typography>
          )}
        </Stack>

        {/* Category Field */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="h3">Category</Typography>
          <select
            {...register("category")}
            className={errors.category ? styles.inputError : ""}
            disabled={isSubmitting}
          >
            <option value="">-- Choose --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.category && (
            <Typography as="span" className={styles.error}>
              ⚠️ {errors.category.message}
            </Typography>
          )}
        </Stack>

        {/* Binary Checkboxes Fields */}
        <Stack direction="column" gap={8} align="stretch">
          <Stack direction="row" gap={16} align="center">
            <label>
              <input type="checkbox" {...register("containsProtein")} disabled={isSubmitting} /> Contains Protein
            </label>
            <label>
              <input type="checkbox" {...register("containsFiber")} disabled={isSubmitting} /> Contains Fiber
            </label>
          </Stack>
        </Stack>

        {/* What Protein Fields */}
        {containsProteinWatch && (
          <Stack direction="column" gap={8} align="stretch">
            <Typography as="label">What Protein?</Typography>
            <Stack direction="row" gap={16} wrap>
              {proteins.map((prot) => (
                <label key={prot}>
                  <input
                    type="checkbox"
                    value={prot}
                    {...register("whatProtein")}
                    disabled={isSubmitting}
                  />{" "}
                  {prot}
                </label>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Ingredients Array Fields */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Ingredients</Typography>
          {ingredientFields.map((field, index) => (
            <Stack key={field.id} direction="column" gap={8} align="stretch">
              <Stack direction="row" gap={8} align="center">
                <input
                  type="text"
                  {...register(`ingredients.${index}.name`)}
                  className={errors.ingredients?.[index]?.name ? styles.inputError : ""}
                  disabled={isSubmitting}
                  placeholder={`Ingredient #${index + 1}`}
                />
                {ingredientFields.length > 3 && (
                  <button type="button" onClick={() => removeIngredient(index)} disabled={isSubmitting}>
                    <Trash2 size={18} color="red" />
                  </button>
                )}
              </Stack>
            </Stack>
          ))}
          <button type="button" onClick={() => appendIngredient({ name: "" })} className={styles.addButton} disabled={isSubmitting}>
            <Plus size={16} /> Add Ingredient
          </button>
        </Stack>

        {/* Steps Array Fields */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Steps</Typography>
          {stepFields.map((field, index) => (
            <Stack key={field.id} direction="column" gap={8} align="stretch">
              <Stack direction="row" gap={8} align="center">
                <textarea
                  {...register(`steps.${index}.name`)}
                  className={errors.steps?.[index]?.name ? styles.inputError : ""}
                  disabled={isSubmitting}
                  placeholder={`Step Description #${index + 1}`}
                />
                {stepFields.length > 2 && (
                  <button type="button" onClick={() => removeStep(index)} disabled={isSubmitting}>
                    <Trash2 size={18} color="red" />
                  </button>
                )}
              </Stack>
            </Stack>
          ))}
          <button type="button" onClick={() => appendStep({ name: "" })} className={styles.addButton} disabled={isSubmitting}>
            <Plus size={16} /> Add Step
          </button>
        </Stack>

        {/* Keywords Array Fields */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Keywords</Typography>
          {keywordFields.map((field, index) => (
            <Stack key={field.id} direction="column" gap={8} align="stretch">
              <Stack direction="row" gap={8} align="center">
                <input
                  type="text"
                  {...register(`keyWords.${index}.name`)}
                  className={errors.keyWords?.[index]?.name ? styles.inputError : ""}
                  disabled={isSubmitting}
                  placeholder={`Keyword #${index + 1}`}
                />
                {keywordFields.length > 2 && (
                  <button type="button" onClick={() => removeKeyword(index)} disabled={isSubmitting}>
                    <Trash2 size={18} color="red" />
                  </button>
                )}
              </Stack>
            </Stack>
          ))}
          <button type="button" onClick={() => appendKeyword({ name: "" })} className={styles.addButton} disabled={isSubmitting}>
            <Plus size={16} /> Add Keyword
          </button>
        </Stack>

        {/* Upload Image Field */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="h3">Recipe Image</Typography>
          <Controller
            name="uploadImage"
            control={control}
            render={({ field }) => (
              <UploadImage
                value={field.value}
                onChange={field.onChange}
                maxFiles={1}
                disabled={isSubmitting}
              />
            )}
          />
        </Stack>

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? "Saving..." : isEdit ? "Update Recipe" : "Save Recipe"}
        </button>
      </Stack>
    </form>
  );
};
