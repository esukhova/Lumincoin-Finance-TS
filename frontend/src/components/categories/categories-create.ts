import {AuthUtils} from "../../utils/auth-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsTypesType} from "../../types/operations-types/operations-types.type";
import {CategoriesReturnObjectType} from "../../types/categories-types/categories-returnObject.type";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";

export class CategoriesCreate {
    readonly openNewRoute: Function;
    readonly type: OperationsTypesType;
    readonly titleElement: HTMLElement | null = null;
    private existingCategoriesTitles: string[] = [];

    constructor(openNewRoute: Function, type: OperationsTypesType) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.titleElement = document.getElementById('title-input');
        if (!this.titleElement) return;

        this.getCategories().then();

        document.getElementById('createBtn')?.addEventListener('click', this.createCategory.bind(this));
    }

    private async getCategories(): Promise<void> {
        const response: CategoriesReturnObjectType = await CategoriesService.getCategories(this.type);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        if (response.categories && response.categories.length > 0) {
            for (let i = 0; i < response.categories.length; i++) {
                this.existingCategoriesTitles.push(response.categories[i].title.toLowerCase());
            }
        }
    }

    private async createCategory() {

        if (ValidationUtils.validateNewCategory(this.titleElement as HTMLInputElement, this.existingCategoriesTitles)) {

            const createData = {
                title: (this.titleElement as HTMLInputElement).value
            }
            const response: DefaultReturnObjectType = await CategoriesService.createCategory(this.type, createData);
            if (response.error) {
                alert(response.error);
                if (response.redirect) {
                    this.openNewRoute(response.redirect);
                }
                return;
            }

            this.openNewRoute('/categories/' + this.type);
        }
    }
}