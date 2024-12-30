import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-servise";
import {CategoriesService} from "../../services/categories-service";
import {OperationsTypesType} from "../../types/operations-types/operations-types.type";
import {CategoriesReturnObjectType} from "../../types/categories-types/categories-returnObject.type";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";

export class OperationsCreate {
    readonly openNewRoute: Function;
    readonly type: string | null = null;

    readonly selectTypeElement: HTMLElement | null = null;
    readonly amountElement: HTMLElement | null = null;
    readonly amountDivElement: HTMLElement | null = null;
    readonly amountErrorElement: HTMLElement | null = null;
    readonly dateElement: HTMLElement | null = null;
    readonly commentElement: HTMLElement | null = null;
    private selectCategoryElement: HTMLElement | null = null;
    private categoryId: number | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.selectTypeElement = document.getElementById('select-type');
        this.amountElement = document.getElementById('amount');
        this.amountDivElement = document.getElementById('amount-div');
        this.amountErrorElement = document.getElementById('look-like-input-error');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');

        this.type = UrlUtils.getUrlParam('type');
        if (!this.type) {
            this.openNewRoute('/');
            return;
        }

        const datePicker: HTMLElement | null = document.getElementById('ui-datepicker-div');

        if (datePicker) {
            datePicker.remove();
        }

        $('#date').datepicker();

        this.defaultFill(this.type as OperationsTypesType).then();

        this.amountDivElement?.addEventListener('focusout', this.validateForm.bind(this));
        const createBtn: HTMLElement | null = document.getElementById('createBtn');
        createBtn?.addEventListener('click', this.createOperation.bind(this));

    }

    private async defaultFill(type: OperationsTypesType = OperationsTypesType.expense): Promise<void> {
        if (this.selectTypeElement) {
            (this.selectTypeElement as HTMLInputElement).value = type;
            this.selectTypeElement.setAttribute('disabled', 'disabled');
        }
        if (this.amountElement && this.amountDivElement) {
            (this.amountElement as HTMLInputElement).value = this.amountDivElement.innerText;
        }

        this.selectCategoryElement = await CommonUtils.getSelectCategory({type}, this.openNewRoute);
        document.getElementById('form')?.insertBefore((this.selectCategoryElement as Node), this.amountElement);
        this.selectCategoryElement = document.getElementById('select-category');

        $('#date').datepicker('setDate', 'today');
    }

    private validateForm(): boolean {
        if (!this.amountElement || !this.amountErrorElement || !this.amountDivElement || !this.amountDivElement.parentElement) return false;

        (this.amountElement as HTMLInputElement).value = this.amountDivElement.innerText;

        let isValid: boolean = true;
        if ((/^[1-9]\d+$/.test((this.amountElement as HTMLInputElement).value)) && (+(this.amountElement as HTMLInputElement).value > 0)) {
            this.amountDivElement.parentElement.classList.remove('is-invalid');
            this.amountErrorElement.style.display = 'none';
        } else {
            this.amountDivElement.parentElement.classList.add('is-invalid');
            isValid = false;
            this.amountErrorElement.style.display = 'block';
        }

        return isValid;
    }

    private async getCategoryId(type: OperationsTypesType): Promise<void> {
        const response: CategoriesReturnObjectType = await CategoriesService.getCategories(type);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        if (response.categories && response.categories.length > 0 && this.selectCategoryElement) {
            for (let i = 0; i < response.categories.length; i++) {
                if (response.categories[i].title.toLowerCase() === (this.selectCategoryElement as HTMLSelectElement).value.toLowerCase()) {
                    this.categoryId = response.categories[i].id;
                    return;
                }
            }
        }
    }


    private async createOperation(e: Event): Promise<void> {
        e.preventDefault();

        await this.getCategoryId(this.type as OperationsTypesType);

        if (!this.selectTypeElement || !this.amountDivElement || !this.dateElement || !this.commentElement || !this.categoryId) {
            this.openNewRoute('/');
            return;
        }

        if (this.validateForm()) {

            const createData = {
                type: (this.selectTypeElement as HTMLInputElement).value,
                amount: Number(this.amountDivElement.innerText),
                date: (this.dateElement as HTMLInputElement).value.split('/')[2] + '-' + (this.dateElement as HTMLInputElement).value.split('/')[0] + '-' + (this.dateElement as HTMLInputElement).value.split('/')[1],
                comment: (this.commentElement as HTMLTextAreaElement).value ? (this.commentElement as HTMLTextAreaElement).value : " ",
                category_id: this.categoryId
            }

            const response: DefaultReturnObjectType = await OperationsService.createOperation(createData);
            if (response.error) {
                alert(response.error);
                if (response.redirect) {
                    this.openNewRoute(response.redirect);
                }
                return;
            }

            this.openNewRoute('/operations');
            return;
        }
    }
}