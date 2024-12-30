import config from "../config/config";
import {UserInfoType} from "../types/auth-types/user-info.type";
import {AuthType} from "../types/auth-types/auth.type";
import {RefreshResponseType} from "../types/auth-types/refresh-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);

    }

    public static getAuthInfo(key: string): string | AuthType | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                accessToken: localStorage.getItem(this.accessTokenKey),
                refreshToken: localStorage.getItem(this.refreshTokenKey),
                userInfo: localStorage.getItem(this.userInfoKey),
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | AuthType | null = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: (typeof refreshToken === 'string' ? refreshToken : refreshToken.refreshToken)})
            })

            if (response && response.status === 200) {
                const tokens: DefaultResponseType | RefreshResponseType | null = await response.json();
                if (tokens) {
                    if ((tokens as DefaultResponseType).error !== undefined) {
                        result = false;
                    } else {
                        this.setAuthInfo((tokens as RefreshResponseType).tokens.accessToken, (tokens as RefreshResponseType).tokens.refreshToken);
                        result = true;
                    }
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }

        return result;
    }
}