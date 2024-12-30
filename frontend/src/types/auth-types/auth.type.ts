import {AuthUtils} from "../../utils/auth-utils";

export type AuthType = {
    accessToken:  string | null,
    refreshToken: string | null,
    userInfo: string | null
}