import { useGetRecipesQuery, useDeleteRecipeMutation } from "@/entities/recipes";
import { Stack } from "@/shared/ui/Stack/Stack";
import { Typography } from "@/shared/ui/Typography";
import { Plus, Trash2 } from "lucide-react";
import { getStyles } from "@/shared/lib";
import styles from "./RecipePreview.module.scss";

interface RTKQuerySerializedError {
  status: number;
  data?: { message?: string };
}

interface RecipePreviewListProps {
  onAddNewClick: () => void;
}

export const RecipePreview = ({ onAddNewClick }: RecipePreviewListProps) => {
  const { data: recipes = [], isLoading, isError } = useGetRecipesQuery({});
  const [deleteRecipe] = useDeleteRecipeMutation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipe({ _id: id }).unwrap();
      } catch (err: unknown) {
        console.error("Delete failed:", err);
        let msg = "Failed to delete recipe.";
        if (err && typeof err === 'object' && 'data' in err) {
          const rtkError = err as RTKQuerySerializedError;
          if (rtkError.data?.message) msg = rtkError.data.message;
        }
        alert(msg);
      }
    }
  };

  return (
    <Stack direction="column" gap={24} align="stretch" className={styles.container} max>
      {/* Поправлено: используем кастомные пропсы variant и font */}
      <Typography variant="h1" font="poiretOne" className={styles.title}>
        Recipes Workspace
      </Typography>

      {isLoading && <Typography variant="body16">Loading recipes database...</Typography>}
      
      {/* Поправлено: убран инлайн-стиль цвета ошибки */}
      {isError && (
        <Typography variant="body16" className={styles.errorMessage}>
          Error loading recipes.
        </Typography>
      )}

      {!isLoading && !isError && (
        /* ИСПРАВЛЕНО: Теперь карточки лежат в Stack с direction="row" и wrap={true} */
        <Stack direction="row" wrap gap={24} align="start" className={styles.recipesGrid} max>
          
          {/* КАРТОЧКА №1: ДОБАВИТЬ РЕЦЕПТ */}
          <Stack 
            direction="column" 
            className={getStyles(styles.cardContainer, { [styles.addCard]: true }, [])} 
            onClick={onAddNewClick}
          >
            <div className={getStyles(styles.imageWrapper, { [styles.addCardImageWrapper]: true }, [])}>
              <Stack direction="column" align="center" justify="center" max>
                <div className={styles.plusCircle}>
                  <Plus size={36} color="var(--orange-color)" />
                </div>
              </Stack>
            </div>
            {/* Поправлено: используем валидный variant="h3" */}
            <Typography variant="h3" className={styles.h3}>
              Add New Recipe
            </Typography>
          </Stack>

          {/* ОСТАЛЬНЫЕ КАРТОЧКИ: РЕЦЕПТЫ ИЗ БАЗЫ */}
          {recipes.map((recipe) => (
            <Stack 
              key={recipe._id} 
              direction="column" 
              className={getStyles(styles.cardContainer, {}, [])}
            >
              <div className={getStyles(styles.imageWrapper, {}, [])}>
                <img 
                  src={recipe.imgSource || "https://placehold.co"} 
                  alt={recipe.title} 
                  className={styles.recipeImg} 
                />
                <div className={styles.imageOverlay} />
                
                <button 
                  type="button" 
                  className={styles.deleteBtn}
                  onClick={(e) => recipe._id && handleDelete(e, recipe._id)}
                  title="Delete Recipe"
                >
                  <Trash2 size={16} color="white" />
                </button>
              </div>
              
              <Typography variant="h3" className={styles.h3}>
                {recipe.title}
              </Typography>
            </Stack>
          ))}

        </Stack>
      )}
    </Stack>
  );
};
