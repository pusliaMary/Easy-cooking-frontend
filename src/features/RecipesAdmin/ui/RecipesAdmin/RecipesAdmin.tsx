import { 
  useGetRecipeByIdQuery, 
  useCreateRecipeMutation, 
  useEditRecipeMutation
} from '@/entities/recipes/api/api';
import { RecipesForm } from '../RecipesForm/RecipesForm';
import type { RecipeFormInput } from '../../lib/recipeZodSchema';
import type { Recipe } from '@/entities/recipes'; // Импортируем интерфейс Recipe из ваших типов
import style from './RecipesAdmin.module.scss';
import { toast } from '@/shared/ui/Toast';

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

  const { data: recipeData, isLoading, isError } = useGetRecipeByIdQuery(
    recipeId ?? '',
    { skip: !isEditMode }
  );

  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [editRecipe, { isLoading: isEditing }] = useEditRecipeMutation();

  const isSubmitting = isCreating || isEditing;

  
  const handleSubmitForm = async (data: RecipeFormInput, resetForm: () => void) => {
    try {
      
      const stepsArray: string[] = data.steps?.map((step) => step.name).filter(Boolean) || [];
      const keywordsArray: string[] = data.keyWords?.map((word) => word.name).filter(Boolean) || [];
      const imageString: string = data.uploadImage?.[0]?.preview || "";

      // Собираем чистый объект, полностью соответствующий интерфейсу Recipe
      const baseRecipeData = {
        title: data.title,
        category: data.category,
        containsProtein: data.containsProtein,
        containsFiber: data.containsFiber,
        whatProtein: data.containsProtein ? data.whatProtein : [],
        ingredients: data.ingredients || [], // Оставляем как есть, так как бэкенд ждет { name: string }[]
        steps: stepsArray,         // Передаем чистый string[]
        keyWords: keywordsArray,   // Передаем чистый string[]
        imgSource: imageString,    // Передаем чистый string
      };

      if (isEditMode && recipeId) {
        // Явно типизируем объект для мутации обновления: Partial<Recipe> & { _id: string }
        const updatePayload: Partial<Recipe> & { _id: string } = {
          _id: recipeId,
          ...baseRecipeData,
        };
        await editRecipe(updatePayload).unwrap();
        toast.success(`Recipe "${data.title}" updated successfully.`);
      } else {
        // Явно типизируем объект для мутации создания: Partial<Recipe>
        const createPayload: Partial<Recipe> = baseRecipeData;
        await createRecipe(createPayload).unwrap();
        toast.success(`Recipe "${data.title}" created successfully!`);
      }
      
      resetForm(); 
      onSuccess(); 
    } catch (error) {
      console.error('Failed to save recipe:', error);
      const rtkError = error as RTKQueryError;
      const backendMessage = rtkError.data?.message || rtkError.message;
      
      // Показываем ошибку пользователю
      toast.error(
        backendMessage 
          ? `Error: ${backendMessage}` 
          : 'Failed to save recipe. Please check your connection or data.'
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
        <div style={{ color: 'var(--error-color)' }}>
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
