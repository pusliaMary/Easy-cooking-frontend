import { filteredMeal } from "@/shared"
import { Button } from "@/shared/ui/Button"
import { Stack } from "@/shared/ui/Stack"

export const Recipes = () => {
    return (
        <Stack tag="section" max>
            <Stack 
                justify="center" 
                wrap 
                max>
                    
                        {filteredMeal.map(({label, value}) => {
                            return (
                                <Stack justify="start" key={value}>
                                    <Button>
                                        {label}
                                    </Button>
                                </Stack>
                            )
                            
                        })}
                    
            </Stack>
        </Stack>
    )
}