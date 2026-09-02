import { RecipesForm } from '../RecipesForm/RecipesForm'
import { useCreateRecipeMutation, useUploadImageMutation } from "@/entities/recipes/api/api"; 
import type { RecipeFormInput } from "../..//lib/recipeZodSchema";

export const RecipesAdmin = () => {
  
  const [uploadImage, { isLoading: isImageUploading }] = useUploadImageMutation();
  const [createRecipe, { isLoading: isRecipeSaving }] = useCreateRecipeMutation();

  const handleFormSubmit = async (data: RecipeFormInput) => {
    try {
      const targetFile = data.uploadImage?.[0]?.file;
      if (!targetFile) {
        alert("Image file is missing!");
        return;
      }

      const fileData = new FormData();
      fileData.append("image", targetFile);

      const uploadResult = await uploadImage(fileData).unwrap();
      const imgSourceUrl = uploadResult.url;

      const newRecipePayload = {
        title: data.title,
        category: data.category,
        containsProtein: data.containsProtein,
        whatProtein: data.whatProtein,
        containsFiber: data.containsFiber,
        ingredients: data.ingredients,
        steps: data.steps.map((step) => step.name),
        keyWords: data.keyWords.map((keyword) => keyword.name),
        imgSource: imgSourceUrl,
      };

      await createRecipe(newRecipePayload).unwrap();
      
      alert("Recipe created successfully!");
    } catch (error) {
      console.error("Failed to process recipe submission:", error);
      alert("An error occurred while saving the recipe.");
    }
  };

  const isSubmitting = isImageUploading || isRecipeSaving;

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <RecipesForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
