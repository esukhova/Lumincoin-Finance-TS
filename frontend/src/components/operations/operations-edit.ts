import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-servise";
import {OperationResponseType} from "../../types/operations-types/operation-response.type";
import {OperationReturnObjectType} from "../../types/operations-types/operation-returnObject.type";
import {DefaultReturnObjectType} from "../../types/default-returnObject.type";

export class OperationsEdit {
    readonly openNewRoute: Function;
    readonly id: number | null = null;

    readonly selectTypeElement: HTMLElement | null = null;
    readonly amountElement: HTMLElement | null = null;
    readonly amountDivElement: HTMLElement | null = null;
    readonly amountErrorElement: HTMLElement | null = null;
    readonly dateElement: HTMLElement | null = null;
    readonly commentElement: HTMLElement | null = null;
    private selectCategoryElement: HTMLElement | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.id = Number(UrlUtils.getUrlParam('id'));
        if (!this.id) {
            return this.openNewRoute('/');
        }

        this.selectTypeElement = document.getElementById('select-type');
        this.amountElement = document.getElementById('amount');
        this.amountDivElement = document.getElementById('amount-div');
        this.amountErrorElement = document.getElementById('look-like-input-error');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');


        $('#date').datepicker();

        this.getOperation(this.id).then();

        this.amountDivElement?.addEventListener('focusout', this.validateForm.bind(this));
        document.getElementById('editBtn')?.addEventListener('click', this.editOperation.bind(this));
    }

    private async getOperation(id: number): Promise<void> {

        const response: OperationReturnObjectType = await OperationsService.getOperation(id);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        if (response.operation) {
            this.showOperation(response.operation).then();
        }
    }

    private async showOperation(operation: OperationResponseType): Promise<void> {

        if (this.selectTypeElement) {
            (this.selectTypeElement as HTMLSelectElement).value = operation.type;
            this.selectTypeElement.setAttribute('disabled', 'disabled');
        }

        if (this.amountElement && this.amountDivElement) {
            (this.amountElement as HTMLInputElement).value = operation.amount.toString();
            this.amountDivElement.innerText = (this.amountElement as HTMLInputElement).value;
        }

        const selectCategoryElement: HTMLElement | null = await CommonUtils.getSelectCategory(operation, this.openNewRoute)
        document.getElementById('form')?.insertBefore((selectCategoryElement as Node), this.amountElement);
        this.selectCategoryElement = document.getElementById('select-category');

        $('#date').datepicker("setDate", new Date(operation.date.split('-').join('/')));

        if (this.commentElement) {
            (this.commentElement as HTMLInputElement).value = operation.comment;
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.amountElement && this.amountDivElement && this.amountDivElement.parentElement && this.amountErrorElement) {
            (this.amountElement as HTMLInputElement).value = this.amountDivElement.innerText;

            if ((/^[1-9]\d+$/.test((this.amountElement as HTMLInputElement).value)) && (+(this.amountElement as HTMLInputElement).value > 0)) {
                this.amountDivElement.parentElement.classList.remove('is-invalid');
                this.amountErrorElement.style.display = 'none';
            } else {
                this.amountDivElement.parentElement.classList.add('is-invalid');
                isValid = false;
                this.amountErrorElement.style.display = 'block';
            }
        }

        return isValid;
    }

    private async editOperation(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            if (!this.selectTypeElement || !this.amountDivElement || !this.dateElement || !this.commentElement || !this.selectCategoryElement || !this.id) return;

            const editData = {
                type: (this.selectTypeElement as HTMLSelectElement).value,
                amount: Number(this.amountDivElement.innerText),
                date: (this.dateElement as HTMLInputElement).value.split('/')[2] + '-' + (this.dateElement as HTMLInputElement).value.split('/')[0] + '-' + (this.dateElement as HTMLInputElement).value.split('/')[1],
                comment: (this.commentElement as HTMLInputElement).value,
                category_id: (this.selectCategoryElement as HTMLSelectElement).selectedIndex + 1
            };

            const response: DefaultReturnObjectType = await OperationsService.editOperation(this.id, editData);
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
}