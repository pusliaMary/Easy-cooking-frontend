import { 
  useGetRecipeByIdQuery, 
  useCreateRecipeMutation, 
  useEditRecipeMutation
} from '@/entities/recipes/api/api';
import { RecipesForm } from '../RecipesForm/RecipesForm';
import type { RecipeFormInput } from '../../lib/recipeZodSchema';
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
      // 1. Создаем пустой объект FormData
      const formData = new FormData();

      // 2. Наполняем базовые строковые и булевые поля
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("containsProtein", String(data.containsProtein));
      formData.append("containsFiber", String(data.containsFiber));

      // 3. Формируем плоские массивы строк из структуры useFieldArray формы
      const stepsArray = data.steps?.map((step) => step.name).filter(Boolean) || [];
      const keywordsArray = data.keyWords?.map((word) => word.name).filter(Boolean) || [];
      const ingredientsArray = data.ingredients?.map((ing) => ({ name: ing.name })) || [];
      const proteinArray = data.containsProtein ? data.whatProtein || [] : [];

      // 4. Сериализуем все массивы в JSON-строки, как жестко ожидает бэкенд
      formData.append("steps", JSON.stringify(stepsArray));
      formData.append("keyWords", JSON.stringify(keywordsArray));
      formData.append("ingredients", JSON.stringify(ingredientsArray));
      formData.append("whatProtein", JSON.stringify(proteinArray));

      // 5. Обработка изображения из компонента UploadImage
      if (data.uploadImage && data.uploadImage.length > 0) {
        const imageObj = data.uploadImage[0];

        if (imageObj.file) {
          // Если выбран новый физический файл, отправляем его как File под ключом 'uploadImage'
          formData.append("uploadImage", imageObj.file);
        } else if (imageObj.preview) {
          // Если изображение старое (при редактировании), передаем сохраненный URL в imgSource
          formData.append("imgSource", imageObj.preview);
        }
      }

      // 6. Вызываем соответствующую мутацию RTK Query
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
      console.error('Failed to save recipe:', error);
      const rtkError = error as RTKQueryError;
      const backendMessage = rtkError.data?.message || rtkError.message;
      
      toast.error(
        backendMessage 
          ? `Error: ${backendMessage}` 
          : 'Failed to save recipe. Please check your data.'
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
