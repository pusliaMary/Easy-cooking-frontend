import { RecipesForm } from '../RecipesForm/RecipesForm';
import { useCreateRecipeMutation, useUploadImageMutation } from "@/entities/recipes/api/api"; 
import type { RecipeFormInput } from "../../lib/recipeZodSchema";

// Явная типизация для структуры ошибки, возвращаемой с вашего Express-бэкенда
interface BackendErrorData {
  message?: string;
}

interface RTKQuerySerializedError {
  status: number;
  data?: BackendErrorData;
}

interface RecipesAdminProps {
  onSuccess?: () => void;
}

export const RecipesAdmin = ({ onSuccess }: RecipesAdminProps) => {
  // Указываем строгие типы для мутаций вместо дефолтных дженериков
  const [uploadImage, { isLoading: isImageUploading }] = useUploadImageMutation();
  const [createRecipe, { isLoading: isRecipeSaving }] = useCreateRecipeMutation();

  const handleFormSubmit = async (data: RecipeFormInput, resetForm?: () => void) => {
    try {
      const targetFile = data.uploadImage?.[0]?.file;
      if (!targetFile) {
        alert("Image file is missing!");
        return;
      }

      // 1. Подготовка бинарных данных изображения для FormData
      const fileData = new FormData();
      fileData.append("image", targetFile);

      // 2. Отправка изображения на сервер
      const uploadResult = await uploadImage(fileData).unwrap();
      const imgSourceUrl = uploadResult?.url;

      if (!imgSourceUrl) {
        throw new Error("The server did not return a valid image URL.");
      }

      // 3. Формирование плоской структуры данных для бэкенда
      const newRecipePayload = {
        title: data.title,
        category: data.category,
        containsProtein: data.containsProtein,
        whatProtein: data.containsProtein ? data.whatProtein : [],
        containsFiber: data.containsFiber,
        ingredients: data.ingredients,
        steps: data.steps.map((step) => step.name.trim()),
        keyWords: data.keyWords.map((keyword) => keyword.name.trim()),
        imgSource: imgSourceUrl,
      };

      // 4. Отправка метаданных рецепта в базу данных
      await createRecipe(newRecipePayload).unwrap();
      
      alert("Recipe created successfully!");
      
      if (resetForm) resetForm();
      if (onSuccess) onSuccess();

    } catch (error: unknown) { // FIXED: Изменено с any на unknown для безопасности типов
      console.error("Failed to process recipe submission:", error);
      
      let serverMessage = "An unexpected error occurred.";

      // Безопасное приведение типов (Type Guard) для извлечения ошибки из RTK Query / Axios
      if (error && typeof error === 'object' && 'data' in error) {
        const rtkError = error as RTKQuerySerializedError;
        if (rtkError.data?.message) {
          serverMessage = rtkError.data.message;
        }
      } else if (error instanceof Error) {
        // Обычные клиентские ошибки (например, throw new Error)
        serverMessage = error.message;
      }
      
      alert(`Submission failed: ${serverMessage}`);
    }
  };

  const isSubmitting = isImageUploading || isRecipeSaving;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
      <RecipesForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
