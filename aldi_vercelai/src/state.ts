import type { AldiAssistantState } from "./types.js";

export const initialState = (): AldiAssistantState => ({
  excludePantry: undefined,
});

export const stateSummary = (state: AldiAssistantState): string => {
  return JSON.stringify(
    {
      selectedRecipeId: state.selectedRecipeId,
      selectedRecipeName: state.selectedRecipeName,
      portions: state.portions,
      excludePantry: state.excludePantry,
      selectedStoreId: state.selectedStoreId,
      selectedStoreName: state.selectedStoreName,
      hasRecipeDetails: Boolean(state.recipeDetails),
      hasRoutePlan: Boolean(state.routePlan),
      recipeOptions: state.recipeOptions?.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
      })),
      storeOptions: state.storeOptions?.map((store) => ({
        id: store.id,
        name: store.name,
        city: store.city,
      })),
    },
    null,
    2,
  );
};
