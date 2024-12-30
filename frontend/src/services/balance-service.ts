import {HttpUtils} from "../utils/http-utils";
import {BalanceReturnObjectType} from "../types/balance-returnObject.type";
import {HttpResponseType} from "../types/http-response.type";

export class BalanceService {

    public static async getBalance(): Promise<BalanceReturnObjectType> {

        const returnObject: BalanceReturnObjectType = {
            error: false,
            redirect: null,
        };

        const result: HttpResponseType = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }

    public static async updateBalance(data: { newBalance: number }): Promise<BalanceReturnObjectType> {

        const returnObject: BalanceReturnObjectType= {
            error: false,
            redirect: null
        };

        const result: HttpResponseType = await HttpUtils.request('/balance', 'PUT', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.balance = result.response.balance;
        return returnObject;
    }
}