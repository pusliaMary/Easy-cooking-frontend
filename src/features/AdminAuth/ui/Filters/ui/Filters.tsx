import { filteredMeal, filteredRecipeBase } from "@/shared";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { useRef } from "react";
import styles from "./Filters.module.scss";
import { getStyles } from "@/shared/lib/getStyle/getStyle";

export const Filters = () => {
  const targetRef = useRef(null);

  return (
    <Stack tag="section" justify="around" max className={styles.filterSection}>
      <Stack
        direction="column"
        justify="between"
        ref={targetRef as React.Ref<never>}
        className={getStyles(styles.filtersImgBtn, {}, [])}
      >
        {filteredMeal.map(({ label, value }) => {
          return (
            <Button key={value} className={styles.mealButton} size="sm">
              {label.toUpperCase()}
            </Button>
          );
        })}
      </Stack>

      <Stack direction="column" justify="between" align="center">
        <Stack
          ref={targetRef as React.Ref<never>}
          justify="between"
          align="start"
          className={getStyles(styles.filtersImgBtn, {}, [])}
        >
          {filteredRecipeBase.map(({ label, value }) => {
            return (
              <Button key={value} className={styles.filterBaseButton}>
                {label}
              </Button>
            );
          })}
        </Stack>
        <Button className={styles.primaryButton} variant="primary" size="sm">
          Get your recipes
        </Button>
      </Stack>
    </Stack>
  );
};
