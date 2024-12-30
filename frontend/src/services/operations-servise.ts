import {HttpUtils} from "../utils/http-utils";
import {OperationsReturnObjectType} from "../types/operations-types/operations-returnObject.type";
import {HttpResponseType} from "../types/http-response.type";
import {OperationReturnObjectType} from "../types/operations-types/operation-returnObject.type";
import {OperationType} from "../types/operations-types/operation.type";
import {DefaultReturnObjectType} from "../types/default-returnObject.type";

export class OperationsService {

    public static async getOperations(period: string): Promise<OperationsReturnObjectType> {

        const returnObject: OperationsReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/operations?period=' + period);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе данных. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operations = result.response;
        return returnObject;
    }

    public static async getOperation(id: number): Promise<OperationReturnObjectType> {

        const returnObject: OperationReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе данных. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.operation = result.response;
        return returnObject;
    }

    public static async createOperation(data: OperationType): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при сохранении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async deleteOperation(id: number): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }

    public static async editOperation(id: number, data: OperationType): Promise<DefaultReturnObjectType> {

        const returnObject: DefaultReturnObjectType = {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/operations/' + id, 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании операции. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}