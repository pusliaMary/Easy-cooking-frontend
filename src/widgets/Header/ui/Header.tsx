import { Stack } from "@/shared/ui/Stack";
import style from "./Header.module.css";
import { Typography } from "@/shared/ui/Typography";

export const Header = () => {
    return (
    <Stack
            tag="header"
            align="center"
            className={style.header}
            id="header"
        >
        <Typography variant="h1" className="mobileTitle">
            What do you want to eat?
        </Typography>      
    </Stack>
    )
}