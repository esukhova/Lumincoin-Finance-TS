import {HttpUtils} from "../utils/http-utils";
import {LoginType} from "../types/auth-types/login.type";
import {HttpResponseType} from "../types/http-response.type";
import {SignupType} from "../types/auth-types/signup.type";
import {SignupResponseType} from "../types/auth-types/signup-response.type";
import {LoginResponseType} from "../types/auth-types/login-response.type";

export class AuthService {

    public static async logIn(data: LoginType): Promise<LoginResponseType | null> {
        const result: HttpResponseType = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.tokens || !result.response.user))) {
            return null;
        }

        return result.response;
    }

    public static async signUp(data: SignupType): Promise<SignupResponseType | null> {
        const result: HttpResponseType = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && !result.response.user)) {
            return null;
        }

        return result.response;
    }

    public static async logOut(data: { refreshToken: string | null }): Promise<void> {
        const result: HttpResponseType = await HttpUtils.request('/logout', 'POST', false, data);
    }
}