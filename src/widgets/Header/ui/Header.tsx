import { Stack } from "@/shared/ui/Stack";
import styles from "./Header.module.css";
import { Typography } from "@/shared/ui/Typography";

export const Header = () => {
    return (
    <Stack
            tag="header"
            align="center"
            className={styles.header}
            id="header"
        >
        <Typography variant="h1" className={styles.mobileTitle}>
            What do you want to eat?
        </Typography>      
    </Stack>
    )
}