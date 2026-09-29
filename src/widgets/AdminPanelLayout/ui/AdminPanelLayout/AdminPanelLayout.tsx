import { useState, useEffect, useRef } from "react";
import { useSearchParams, useBlocker } from "react-router-dom";
import { SideBar } from "../Sidebar/ui/Sidebar";
import { getEditFeaturesMap, defaultFeature } from "../../lib/editFeaturesMap";
import type { TabKey } from "../../lib/tabs";
import style from "./AdminPanelLayout.module.scss";
import { toast } from "@/shared/ui/Toast";

export const AdminPanelLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const activeToastId = useRef<string | number | null>(null);

  const activeFeature = (searchParams.get("tab") as TabKey) || defaultFeature;
  const selectedRecipeId = searchParams.get("recipeId");

  const blocker = useBlocker(() => isFormDirty);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const toastId = "confirm-leave-toast";
      activeToastId.current = toastId;

      toast.custom(
        <div className={style.confirmToast}>
          <div className={style.toastContent}>
            <h4>⚠️ Unsaved Changes</h4>
            <p>
              You have unsaved changes in your recipe. Do you really want to
              leave?
            </p>
          </div>
          <div className={style.toastActions}>
            <button
              className={style.stayBtn}
              onClick={() => {
                blocker.reset();
                toast.dismiss(toastId);
              }}
            >
              Stay
            </button>
            <button
              className={style.leaveBtn}
              onClick={() => {
                setIsFormDirty(false);
                toast.dismiss(toastId);
                setTimeout(() => blocker.proceed(), 0);
              }}
            >
              Leave
            </button>
          </div>
        </div>,
        {
          toastId,
          autoClose: false,
          closeButton: false,
        },
      );
    }
  }, [blocker]);

  const handleTabClick = (featureKey: TabKey): void => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", featureKey);
    if (featureKey !== "editRecipe") {
      params.delete("recipeId");
    }
    setSearchParams(params);
  };

  const handleSelectRecipe = (id: string | null): void => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("recipeId", id);
    } else {
      params.delete("recipeId");
    }
    setSearchParams(params);
  };

  const featuresMap = getEditFeaturesMap({
    onChangeTab: handleTabClick,
    onSelectRecipe: handleSelectRecipe,
    selectedRecipeId,
    setIsFormDirty,
  });

  const currentActiveForSidebar =
    activeFeature === "createRecipe" || activeFeature === "editRecipe"
      ? "recipesList"
      : activeFeature;

  return (
    <div className={style.layoutWrapper}>
      <SideBar
        activeFeature={currentActiveForSidebar}
        onTabClick={handleTabClick}
      />

      <main className={style.mainContent}>
        {featuresMap[activeFeature] || <div>Feature not found</div>}
      </main>
    </div>
  );
};
