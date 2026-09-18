import {
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useEditRecipeMutation,
} from "@/entities/recipes/api/api";
import { RecipesForm } from "../RecipesForm/RecipesForm";
import type { RecipeFormInput } from "../../lib/recipeZodSchema";
import style from "./RecipesAdmin.module.scss";
import { toast } from "@/shared/ui/Toast";

interface RTKQueryError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}

export interface RecipesAdminProps {
  onSuccess: () => void;
  recipeId?: string | null;
}

export const RecipesAdmin = ({ onSuccess, recipeId }: RecipesAdminProps) => {
  const isEditMode = Boolean(recipeId);

  const {
    data: recipeData,
    isLoading,
    isError,
  } = useGetRecipeByIdQuery(recipeId ?? "", { skip: !isEditMode });

  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [editRecipe, { isLoading: isEditing }] = useEditRecipeMutation();

  const isSubmitting = isCreating || isEditing;

  const handleSubmitForm = async (
    data: RecipeFormInput,
    resetForm: () => void,
  ) => {
    console.log("=== SUBMITTING FORM DATA ===", data);

    try {
      const hasImage =
        data.uploadImage &&
        data.uploadImage.length > 0 &&
        (data.uploadImage[0].file || data.uploadImage[0].preview);

      if (!hasImage) {
        console.warn("Image verification failed. Displaying toast...");
        toast.error(
          "Please add an image. A recipe cannot be saved without an image.",
        );
        return;
      }

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("containsProtein", String(data.containsProtein));
      formData.append("containsFiber", String(data.containsFiber));

      const stepsArray =
        data.steps?.map((step) => step.name).filter(Boolean) || [];
      const keywordsArray =
        data.keyWords?.map((word) => word.name).filter(Boolean) || [];
      const ingredientsArray =
        data.ingredients?.map((ing) => ({ name: ing.name })) || [];
      const proteinArray = data.containsProtein ? data.whatProtein || [] : [];

      formData.append("steps", JSON.stringify(stepsArray));
      formData.append("keyWords", JSON.stringify(keywordsArray));
      formData.append("ingredients", JSON.stringify(ingredientsArray));
      formData.append("whatProtein", JSON.stringify(proteinArray));

      const imageObj = data.uploadImage[0];

      if (imageObj.file) {
        formData.append("uploadImage", imageObj.file);
      } else if (imageObj.preview) {
        formData.append("imgSource", imageObj.preview);
      }

      if (isEditMode && recipeId) {
        await editRecipe({ id: recipeId, formData }).unwrap();
        toast.success(`Recipe "${data.title}" updated successfully.`);
      } else {
        await createRecipe(formData).unwrap();
        toast.success(`Recipe "${data.title}" created successfully!`);
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Failed to save recipe:", error);
      const rtkError = error as RTKQueryError;
      const backendMessage = rtkError.data?.message || rtkError.message;

      toast.error(
        backendMessage
          ? `Error: ${backendMessage}`
          : "Failed to save recipe. Please check your data.",
      );
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className={style.adminWrapper}>
        <div>Loading recipe data for editing...</div>
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className={style.adminWrapper}>
        <div style={{ color: "var(--error-color)" }}>
          Failed to load recipe data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={style.adminWrapper}>
      <RecipesForm
        onSuccess={onSuccess}
        isEdit={isEditMode}
        initialData={recipeData}
        onSubmit={handleSubmitForm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
