import { Stack } from '@/shared/ui/Stack/Stack'
import { Typography } from '@/shared/ui/Typography'
import styles from "./RecipeCard.module.scss";

// RTK-QUERY logic

interface RecipeCardProps {
    img: string;
    title: string;
}


export const RecipeCard = ({ img, title }: RecipeCardProps) => {

    return (
        <Stack direction="column">
            <Typography variant="h3" className={styles.h3}>{title}</Typography>
            <img src={img} alt='pic' height='300px'/>
            
        </Stack>
    )
}