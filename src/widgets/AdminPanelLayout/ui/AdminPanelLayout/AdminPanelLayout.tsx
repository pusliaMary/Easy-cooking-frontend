import { useState } from "react";
import { SideBar } from "../Sidebar/ui/Sidebar";
import { Stack } from "@/shared/ui/Stack";
import { editFeaturesMap, defaultFeature } from "../../lib/editFeaturesMap";
import style from "./AdminPanelLayout.module.scss";

export const AdminPanelLayout = () => {

    const [activeFeature, setActiveFeature] = useState(defaultFeature);
    const handleTabClick = (featureKey: string) => {
        setActiveFeature(featureKey);
    };

    return (
        <Stack className={style.adminContainer}>
            <SideBar activeFeature={activeFeature} onTabClick={handleTabClick} />
            <Stack tag="main" align="center"
                justify="center" className={style.mainContent}
            >
                {editFeaturesMap[activeFeature] || editFeaturesMap[defaultFeature]}
            </Stack>
        </Stack>
    );
};
