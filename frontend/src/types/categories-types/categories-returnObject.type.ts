import {CategoryResponseType} from "./category-response.type";

export type CategoriesReturnObjectType = {
    error: string | boolean,
    redirect: string | null,
    categories?: CategoryResponseType[]
}