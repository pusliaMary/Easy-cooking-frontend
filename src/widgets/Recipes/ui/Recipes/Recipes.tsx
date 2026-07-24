import { Stack } from "@/shared/ui/Stack/Stack";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { useEffect, useState } from "react";

interface Recipe {
    _id: string;
    imgSource: string;
    title: string;
}

export const Recipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const fetchRecipes = async () => {
            try {
                const response = await fetch('https://onrender.com');
                const data: Recipe[] = await response.json();
                if (isMounted) {
                    setRecipes(data);
                }
            } catch (error) {
                console.log('Error fetching recipes', error);
            }
        };

        fetchRecipes();

        return () => {
            isMounted = false;
        };
    }, []);

    // if (isLoading) {
    //     return <div>Загрузка рецептов...</div>;
    // }

    return (
        <Stack>
        
            {recipes.map((recipe) => (
                <RecipeCard img={recipe.imgSource} title={recipe.title} key={recipe._id} />
            ))}
        </Stack>
    );
};

