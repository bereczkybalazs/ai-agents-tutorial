export const API_BASE_URL = "https://hackhaton.internal.zrcn.dev";

export interface AldiAssistantState {
  selectedRecipeId?: number;
  selectedRecipeName?: string;
  portions?: number;
  excludePantry?: boolean;
  selectedStoreId?: number;
  selectedStoreName?: string;
  recipeDetails?: RecipeDetailsResponse;
  routePlan?: RoutePlanResponse;
  recipeOptions?: RecipeSummary[];
  storeOptions?: Store[];
  lastRecipeQuery?: string;
}

export interface RecipeIngredientSummary {
  ingredient_key: string;
  name: string;
  amount: number;
  unit: string;
  category_id: number;
  category: string;
  pantry_staple: boolean;
}

export interface RecipeSummary {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  base_portions: number;
  prep_minutes: number;
  tags: string[];
  ingredients: RecipeIngredientSummary[];
}

export interface RecipesResponse {
  count: number;
  recipes: RecipeSummary[];
}

export interface ProductOption {
  id: number;
  category_id: number;
  category: string;
  name: string;
  price: number;
  wholesale_price: number;
  size: string;
  unit: string;
  unit_amount: number;
  ingredient_key: string;
  packs_needed: number;
  line_price: number;
  line_wholesale: number;
  line_margin: number;
}

export interface RecipeDetailIngredient extends RecipeIngredientSummary {
  scaled_amount: number;
  include_in_shopping_list: boolean;
  product_options: ProductOption[];
  cheapest_option_id: number;
  max_profit_option_id: number;
}

export interface RecipeDetailsResponse {
  recipe: Omit<RecipeSummary, "ingredients">;
  portions: number;
  scale: number;
  exclude_pantry: boolean;
  ingredients: RecipeDetailIngredient[];
  summary: {
    cheapest_basket_total: number;
    profit_optimized_basket_total: number;
    profit_optimized_aldi_margin: number;
    shopping_category_ids: number[];
  };
}

export interface Store {
  id: number;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  grid_size: number;
}

export interface StoresResponse {
  count: number;
  stores: Store[];
}

export interface GridCell {
  x: number;
  y: number;
  type: string;
  category_ids: number[];
  categories: string[];
  label: string;
}

export interface StoreGridResponse {
  store_id: number;
  store_name: string;
  width: number;
  height: number;
  entrance: { x: number; y: number };
  checkout: { x: number; y: number };
  cells: GridCell[];
}

export interface RouteStop {
  order: number;
  x: number;
  y: number;
  category_id: number | null;
  category: string;
  label: string;
  steps_from_previous: number;
}

export interface RoutePlanResponse {
  store_id: number;
  store_name: string;
  required_category_ids: number[];
  unavailable_category_ids: number[];
  stops: RouteStop[];
  total_steps: number;
  path: Array<{ x: number; y: number }>;
}

export interface AldiRunContext {
  state: AldiAssistantState;
}
