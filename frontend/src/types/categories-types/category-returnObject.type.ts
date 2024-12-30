import {CategoryResponseType} from "./category-response.type";

export type CategoryReturnObjectType = {
    error: string | boolean,
    redirect: string | null,
    category?: CategoryResponseType
};
