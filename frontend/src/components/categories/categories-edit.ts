import {AuthUtils} from "../../utils/auth-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsTypesType} from "../../types/operations-types/operations-types.type";
import {CategoryReturnObjectType} from "../../types/categories-types/category-returnObject.type";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";

export class CategoriesEdit {
    readonly openNewRoute: Function;
    readonly type: OperationsTypesType;
    readonly id: number | null = null;
    readonly titleInput: HTMLElement | null = null;

    constructor(openNewRoute: Function, type: OperationsTypesType) {
        this.openNewRoute = openNewRoute;
        this.type = type;
        this.titleInput = document.getElementById('title-input');

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = Number(UrlUtils.getUrlParam('id'));
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.getTitleOfCategory(this.id).then();

        document.getElementById('editBtn')?.addEventListener('click', this.editCategory.bind(this));
    }

    private async getTitleOfCategory(id: number): Promise<void> {

        const response: CategoryReturnObjectType = await CategoriesService.getCategory(this.type, id);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        if (this.titleInput && response.category) {
            (this.titleInput as HTMLInputElement).value = response.category.title;
        }
    }

    private async editCategory(): Promise<void> {
        if (this.titleInput && this.id) {
            const editData = {
                title: (this.titleInput as HTMLInputElement).value
            }

            const response: DefaultReturnObjectType = await CategoriesService.editCategory(this.type, this.id, editData);
            if (response.error) {
                alert(response.error);
                if (response.redirect) {
                    this.openNewRoute(response.redirect);
                }
                return;
            }
        }

        this.openNewRoute('/categories/' + this.type);
    }
}