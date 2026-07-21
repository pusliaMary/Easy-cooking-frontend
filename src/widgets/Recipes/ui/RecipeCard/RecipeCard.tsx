import { Stack } from '@/shared/ui/Stack/Stack'
import { Typography } from '@/shared/ui/Typography'

// RTK-QUERY logic

interface RecipeCardProps {
    img: string;
    title: string;
}


export const RecipeCard = ({ img, title }: RecipeCardProps) => {

    return (
        <Stack direction="column">
            <img src={img} alt='pic' width='300px'/>
            <Typography>{title}</Typography>
        </Stack>
    )
}