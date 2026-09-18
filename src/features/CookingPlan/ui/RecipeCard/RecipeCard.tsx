import { Stack } from "@/shared/ui/Stack/Stack";
import { Typography } from "@/shared/ui/Typography";
import styles from "./RecipeCard.module.scss";

interface RecipeCardProps {
  img: string;
  title: string;
}

export const RecipeCard = ({ img, title }: RecipeCardProps) => {
  return (
    <Stack direction="column" className={styles.cardContainer}>
      <div className={styles.imageWrapper}>
        <img src={img} alt={title} className={styles.recipeImg} />
        <div className={styles.imageOverlay} />
      </div>

      <Typography variant="h3" className={styles.h3}>
        {title}
      </Typography>
    </Stack>
  );
};
