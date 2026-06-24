import { z } from "zod";

export const API_BASE_URL = "https://hackhaton.internal.zrcn.dev";
export const ALDI_STATE_KEY = "aldi-state";

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

export const recipeIngredientSummarySchema = z.object({
  ingredient_key: z.string(),
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
  category_id: z.number().int(),
  category: z.string(),
  pantry_staple: z.boolean(),
});

export const recipeSummarySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  cuisine: z.string(),
  base_portions: z.number().int(),
  prep_minutes: z.number().int(),
  tags: z.array(z.string()),
  ingredients: z.array(recipeIngredientSummarySchema),
});

export const recipesResponseSchema = z.object({
  count: z.number().int(),
  recipes: z.array(recipeSummarySchema),
});

export const productOptionSchema = z.object({
  id: z.number().int(),
  category_id: z.number().int(),
  category: z.string(),
  name: z.string(),
  price: z.number(),
  wholesale_price: z.number(),
  size: z.string(),
  unit: z.string(),
  unit_amount: z.number(),
  ingredient_key: z.string(),
  packs_needed: z.number().int(),
  line_price: z.number(),
  line_wholesale: z.number(),
  line_margin: z.number(),
});

export const recipeDetailIngredientSchema = recipeIngredientSummarySchema.extend({
  scaled_amount: z.number(),
  include_in_shopping_list: z.boolean(),
  product_options: z.array(productOptionSchema),
  cheapest_option_id: z.number().int(),
  max_profit_option_id: z.number().int(),
});

export const recipeDetailsResponseSchema = z.object({
  recipe: recipeSummarySchema.omit({ ingredients: true }),
  portions: z.number().int(),
  scale: z.number(),
  exclude_pantry: z.boolean(),
  ingredients: z.array(recipeDetailIngredientSchema),
  summary: z.object({
    cheapest_basket_total: z.number(),
    profit_optimized_basket_total: z.number(),
    profit_optimized_aldi_margin: z.number(),
    shopping_category_ids: z.array(z.number().int()),
  }),
});

export const storeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  city: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  grid_size: z.number().int(),
});

export const storesResponseSchema = z.object({
  count: z.number().int(),
  stores: z.array(storeSchema),
});

export const gridCellSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
  type: z.string(),
  category_ids: z.array(z.number().int()),
  categories: z.array(z.string()),
  label: z.string(),
});

export const storeGridResponseSchema = z.object({
  store_id: z.number().int(),
  store_name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  entrance: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  checkout: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  cells: z.array(gridCellSchema),
});

export const routeStopSchema = z.object({
  order: z.number().int(),
  x: z.number().int(),
  y: z.number().int(),
  category_id: z.number().int().nullable(),
  category: z.string(),
  label: z.string(),
  steps_from_previous: z.number().int(),
});

export const routePlanResponseSchema = z.object({
  store_id: z.number().int(),
  store_name: z.string(),
  required_category_ids: z.array(z.number().int()),
  unavailable_category_ids: z.array(z.number().int()),
  stops: z.array(routeStopSchema),
  total_steps: z.number().int(),
  path: z.array(
    z.object({
      x: z.number().int(),
      y: z.number().int(),
    }),
  ),
});
