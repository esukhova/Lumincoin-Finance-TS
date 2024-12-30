import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-servise";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";

export class OperationsDelete {
    readonly openNewRoute: Function;
    readonly id: number | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = Number(UrlUtils.getUrlParam('id'));
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.deleteOperation(this.id).then();
    }

    private async deleteOperation(id: number): Promise<void> {

        const response:DefaultReturnObjectType = await OperationsService.deleteOperation(id);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        this.openNewRoute('/operations');
    }
}