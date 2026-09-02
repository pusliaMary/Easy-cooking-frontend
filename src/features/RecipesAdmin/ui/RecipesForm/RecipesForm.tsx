import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Stack } from "@/shared/ui/Stack/Stack";
import { Typography } from "@/shared/ui/Typography";
import { UploadImage } from "@/shared/ui/UploadImage";
import { categories, proteins } from "@/entities/recipes/model/filters";
import { recipeZodSchema } from "../../lib/recipeZodSchema";
import type { RecipeFormInput } from "../../lib/recipeZodSchema";

import styles from "./RecipesForm.module.scss";

interface RecipesFormProps {
  onSubmit: (data: RecipeFormInput) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<RecipeFormInput>;
}

export const RecipesForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
}: RecipesFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormInput>({
    resolver: zodResolver(recipeZodSchema, undefined, {
      raw: true, // Это заставит React Hook Form валидировать структуру Input, игнорируя конфликт с Output
    }),
    defaultValues: {
      title: "",
      category: undefined,
      containsProtein: false,
      whatProtein: [],
      containsFiber: false,
      ingredients: [{ name: "" }, { name: "" }, { name: "" }],
      steps: [{ name: "" }, { name: "" }],
      keyWords: [{ name: "" }, { name: "" }],
      uploadImage: [],
      ...defaultValues,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keyWords",
  });

  const containsProteinWatch = useWatch({
    control,
    name: "containsProtein",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Stack direction="column" gap={24} align="stretch">
        {/* Title */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="label">Recipe Title</Typography>
          <input
            type="text"
            {...register("title")}
            className={errors.title ? styles.inputError : ""}
          />
          {errors.title && (
            <Typography as="span" className={styles.error}>
              {errors.title.message}
            </Typography>
          )}
        </Stack>

        {/* Category */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="label">Category</Typography>
          <select
            {...register("category")}
            className={errors.category ? styles.inputError : ""}
          >
            <option value="">-- Choose --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <Typography as="span" className={styles.error}>
              {errors.category.message}
            </Typography>
          )}
        </Stack>

        {/* Checkboxes */}
        <Stack direction="row" gap={16} align="center">
          <label>
            <input type="checkbox" {...register("containsProtein")} /> Contains
            Protein
          </label>
          <label>
            <input type="checkbox" {...register("containsFiber")} /> Contains
            Fiber
          </label>
        </Stack>

        {/* What Protein */}
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
                  />{" "}
                  {prot}
                </label>
              ))}
            </Stack>
            {errors.whatProtein && (
              <Typography as="span" className={styles.error}>
                {errors.whatProtein.message}
              </Typography>
            )}
          </Stack>
        )}

        {/* Ingredients */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Ingredients</Typography>
          {ingredientFields.map((field, index) => (
            <Stack key={field.id} direction="row" gap={8} align="center">
              <input
                type="text"
                {...register(`ingredients.${index}.name`)}
                className={
                  errors.ingredients?.[index]?.name ? styles.inputError : ""
                }
              />
              {ingredientFields.length > 3 && (
                <button type="button" onClick={() => removeIngredient(index)}>
                  <Trash2 size={18} color="red" />
                </button>
              )}
            </Stack>
          ))}
          {errors.ingredients?.root && (
            <Typography as="span" className={styles.error}>
              {errors.ingredients.root.message}
            </Typography>
          )}
          <button
            type="button"
            onClick={() => appendIngredient({ name: "" })}
            className={styles.addButton}
          >
            <Plus size={16} /> Add Ingredient
          </button>
        </Stack>

        {/* Steps */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Steps</Typography>
          {stepFields.map((field, index) => (
            <Stack key={field.id} direction="row" gap={8} align="center">
              <textarea
                {...register(`steps.${index}.name`)}
                className={errors.steps?.[index]?.name ? styles.inputError : ""}
              />
              {stepFields.length > 2 && (
                <button type="button" onClick={() => removeStep(index)}>
                  <Trash2 size={18} color="red" />
                </button>
              )}
            </Stack>
          ))}
          {errors.steps?.root && (
            <Typography as="span" className={styles.error}>
              {errors.steps.root.message}
            </Typography>
          )}
          <button
            type="button"
            onClick={() => appendStep({ name: "" })}
            className={styles.addButton}
          >
            <Plus size={16} /> Add Step
          </button>
        </Stack>

        {/* Keywords */}
        <Stack direction="column" gap={16} align="stretch">
          <Typography as="h3">Keywords</Typography>
          {keywordFields.map((field, index) => (
            <Stack key={field.id} direction="row" gap={8} align="center">
              <input
                type="text"
                {...register(`keyWords.${index}.name`)}
                className={
                  errors.keyWords?.[index]?.name ? styles.inputError : ""
                }
              />
              {keywordFields.length > 2 && (
                <button type="button" onClick={() => removeKeyword(index)}>
                  <Trash2 size={18} color="red" />
                </button>
              )}
            </Stack>
          ))}
          {errors.keyWords?.root && (
            <Typography as="span" className={styles.error}>
              {errors.keyWords.root.message}
            </Typography>
          )}
          <button
            type="button"
            onClick={() => appendKeyword({ name: "" })}
            className={styles.addButton}
          >
            <Plus size={16} /> Add Keyword
          </button>
        </Stack>

        {/* Upload Image */}
        <Stack direction="column" gap={8} align="stretch">
          <Typography as="label">Recipe Image</Typography>
          <Controller
            name="uploadImage"
            control={control}
            render={({ field }) => (
              <UploadImage
                value={field.value}
                onChange={field.onChange}
                maxFiles={1}
              />
            )}
          />
          {errors.uploadImage && (
            <Typography as="span" className={styles.error}>
              {errors.uploadImage.message}
            </Typography>
          )}
        </Stack>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? "Saving..." : "Save Recipe"}
        </button>
      </Stack>
    </form>
  );
};
