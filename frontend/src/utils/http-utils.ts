import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {HttpResponseType} from "../types/http-response.type";
import {AuthType} from "../types/auth-types/auth.type";

export class HttpUtils {
    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<HttpResponseType> {
        const result: HttpResponseType = {
            error: false,
            response: null
        }

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        }

        let token: string | AuthType | null = null;


        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = (typeof token === 'string'? token : token.accessToken);
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1 - токена нет
                    result.redirect = '/login';
                } else {
                    // 2 - токен устарел/невалидный (нужно обновить)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }


            }
        }

        return result;
    }
}