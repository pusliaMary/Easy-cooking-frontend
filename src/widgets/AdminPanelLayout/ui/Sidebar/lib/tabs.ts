interface NavigationItem {
    key: string,
    label: string
}

export const adminPanelNavigation = {
    recipes: { 
        key: "recipes", 
        label: "Recipes"
    }
} satisfies Record<string, NavigationItem> //satisfies сохраняет точные имена ключей

