import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {AuthType} from "../../types/auth-types/auth.type";

export class Logout {
    openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    private async logout(): Promise<void> {

        const refreshToken: string | AuthType | null = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (refreshToken) {
            await AuthService.logOut({
                refreshToken: (typeof refreshToken === 'string' ? refreshToken : (refreshToken as AuthType).refreshToken),
            });
        }

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}