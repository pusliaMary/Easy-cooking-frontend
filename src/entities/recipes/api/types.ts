import type { CategoryType, ProteinType } from "../model/types";

export interface GetRecipesParams {
  limit?: number;
  page?: number;
  sort?: string;
  title?: string;
  category?: CategoryType;
  containsProtein?: boolean;
  containsFiber?: boolean;
  whatProtein?: ProteinType | ProteinType[];
  keyWords?: string | string[];
  "ingredients.name"?: string | string[];
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | ProteinType[]
    | undefined;
}