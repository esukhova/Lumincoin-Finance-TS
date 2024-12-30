import {AuthUtils} from "../../utils/auth-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsTypesType} from "../../types/operations-types/operations-types.type";
import {CategoriesReturnObjectType} from "../../types/categories-types/categories-returnObject.type";
import {CategoryResponseType} from "../../types/categories-types/category-response.type";

export class Categories {
    readonly openNewRoute: Function;
    readonly type: OperationsTypesType;

    readonly recordsElement: HTMLElement | null = null;
    readonly deleteModalBtnElement: HTMLElement | null = null;
    readonly cancelModalBtnElement: HTMLElement | null = null;

    constructor(openNewRoute: Function, type: OperationsTypesType) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.recordsElement = document.getElementById(this.type + '-cards');
        this.deleteModalBtnElement = document.getElementById('deleteModalBtn');
        this.cancelModalBtnElement = document.getElementById('cancelModalBtn');
        if (this.cancelModalBtnElement) {
            (this.cancelModalBtnElement as HTMLLinkElement).href = '/categories/' + this.type;
        }

        this.getCategories().then();
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

        this.showRecords(response.categories!);
    }

    private showRecords(categories: CategoryResponseType[]): void {
        const cardPlusCol: HTMLElement | null = document.getElementById('card-plus-col');

        if (categories && categories.length > 0 && this.recordsElement) {
            for (let i = 0; i < categories.length; i++) {
                const colElement: HTMLElement | null = document.createElement('div');
                colElement.classList.add('col', 'card-category-col');

                colElement.innerHTML =
                    '  <div class="card">' +
                    '     <div class="card-body">' +
                    '        <h5 class="card-title">' + categories[i].title + '</h5>' +
                    '        <div class="card-buttons">' +
                    '            <a href="/categories/' + this.type + '/edit?id=' + categories[i].id.toString() + '" class="btn card-btn btn-primary">Редактировать</a>' +
                    '            <button class="btn card-btn btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#modal">Удалить</button>' +
                    '        </div>' +
                    '     </div>' +
                    ' </div>';

                this.recordsElement.insertBefore(colElement, cardPlusCol);

                document.getElementsByClassName('delete-btn')[i].addEventListener('click', () => {
                    if (this.deleteModalBtnElement) {
                        (this.deleteModalBtnElement as HTMLLinkElement).href = '/categories/' + this.type + '/delete?id=' + categories[i].id.toString();
                    }
                });
            }

            const cardCategoryCols = document.getElementsByClassName('card-category-col');
            if (cardCategoryCols && cardCategoryCols.length > 0 &&  cardPlusCol) {
                cardPlusCol.style.height = (cardCategoryCols[0] as HTMLElement).offsetHeight + 'px';
            }
        }
    }
}