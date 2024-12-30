import {HttpUtils} from "../utils/http-utils";
import {HttpResponseType} from "../types/http-response.type";
import {CategoriesReturnObjectType} from "../types/categories-types/categories-returnObject.type";
import {CategoryReturnObjectType} from "../types/categories-types/category-returnObject.type";
import {OperationsTypesType} from "../types/operations-types/operations-types.type";
import {DefaultReturnObjectType} from "../types/default-returnObject.type";

export class CategoriesService {

    public static async getCategories(type: OperationsTypesType): Promise<CategoriesReturnObjectType> {

        const returnObject: CategoriesReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResponseType = await HttpUtils.request('/categories/' + type);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    public static async getCategory(type: OperationsTypesType, id: number): Promise<CategoryReturnObjectType> {

        const returnObject: CategoryReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе данных. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    public static async createCategory(type: OperationsTypesType, data: {
        title: string
    }): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/categories/' + type, 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при сохранении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
        }

        return returnObject;
    }

    public static async deleteCategory(type: OperationsTypesType, id: number): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
        }

        return returnObject;
    }

    public static async editCategory(type: OperationsTypesType, id: number, data: {
        title: string
    }): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
        }

        return returnObject;
    }
}