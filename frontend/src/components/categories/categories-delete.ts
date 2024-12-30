import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-servise";
import {OperationsTypesType} from "../../types/operations-types/operations-types.type";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";
import {OperationsReturnObjectType} from "../../types/operations-types/operations-returnObject.type";
import {AuthUtils} from "../../utils/auth-utils";

export class CategoriesDelete {
    readonly openNewRoute: Function;
    readonly type: OperationsTypesType;
    readonly id: number | null = null;

    constructor(openNewRoute: Function, type: OperationsTypesType) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = Number(UrlUtils.getUrlParam('id'));
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.deleteCategory(this.id).then();
    }

    private async deleteCategory(id: number): Promise<void> {

        const response: DefaultReturnObjectType = await CategoriesService.deleteCategory(this.type, id);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        this.updateOperations().then();

        this.openNewRoute('/categories/' + this.type);
    }

    private async updateOperations(): Promise<void> {

        const response: OperationsReturnObjectType = await OperationsService.getOperations('all');
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        if (response.operations && response.operations.length > 0) {
            for (let i = 0; i < response.operations.length; i++) {
                if (!response.operations[i].category) {
                    const responseDeleteOperation: DefaultReturnObjectType = await OperationsService.deleteOperation(response.operations[i].id);
                    if (responseDeleteOperation.error) {
                        alert(responseDeleteOperation.error);
                        if (responseDeleteOperation.redirect) {
                            this.openNewRoute(responseDeleteOperation.redirect);
                        }
                    }
                }
            }
        }
    }
}