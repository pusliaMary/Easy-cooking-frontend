import { filteredMeal, filteredRecipeBase } from "@/shared";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { useRef, useState } from "react";
import styles from "./Filters.module.scss";
import { getStyles } from "@/shared/lib/getStyle/getStyle";

interface FilterItem {
  label: string;
  value: string;
}

export const Filters = () => {
  
  const targetRef = useRef<HTMLDivElement>(null);

  
 const [chosenMeals, setChosenMeals] = useState<string[]>([]);
const [chosenBases, setChosenBases] = useState<string[]>([]);

const toggleMeal = (value: string) => {
  setChosenMeals(prev => 
    prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
  );
};

const toggleBase = (value: string) => {
  setChosenBases(prev => 
    prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
  );
};

  const CreatePlan = () => {
  
  if (chosenMeals.length === 0) {
    alert('Please select at least one meal. Meal-bases are optional.');
  } else {
    alert('Here recipes will be soon');
  }
};

  return (
    <Stack tag="section" justify="around" max className={styles.filterSection}>
      <Stack
        direction="column"
        justify="between"
        ref={targetRef}
        className={getStyles(styles.filtersImgBtn, {}, [])}
      >
        {filteredMeal.map(({ label, value }: FilterItem) => {
          const isSelected = chosenMeals.includes(value)
          return (
            <Button 
              key={value} 
              className={`${styles.mealButton} ${isSelected ? styles.active : ''}`} 
              size="sm" 
              onClick={() => toggleMeal(value)}
            >
              {label.toUpperCase()}
            </Button>
          );
        })}
      </Stack>

      <Stack direction="column" justify="between" align="center">
        <Stack
          ref={targetRef}
          justify="between"
          align="start"
          className={getStyles(styles.filtersImgBtn, {}, [])}
        >
          {filteredRecipeBase.map(({ label, value }: FilterItem) => {
          const isSelected = chosenBases.includes(value)
           return (
              <Button 
                key={value} 
                className={`${styles.filterBaseButton} ${isSelected ? styles.active : ''}`} 
                onClick={() => toggleBase(value)}
              >
                {label}
              </Button>
            );
          })}
        </Stack>
        <Button className={styles.primaryButton} variant="primary" size="sm" onClick={CreatePlan}>
          Get your recipes
        </Button>
      </Stack>
    </Stack>
  );
};
