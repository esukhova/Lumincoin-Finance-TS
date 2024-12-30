import {AuthUtils} from "../../utils/auth-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-servise";
import {OperationsReturnObjectType} from "../../types/operations-types/operations-returnObject.type";
import {OperationResponseType} from "../../types/operations-types/operation-response.type";

export class Operations {
    readonly openNewRoute: Function;
    readonly deleteModalBtnElement: HTMLElement | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.getOperations('all').then();

        this.getIntervals();

        const datePicker: HTMLElement | null = document.getElementById('ui-datepicker-div');

        if (datePicker) {
            datePicker.remove();
        }

        $('#from-interval').datepicker();
        $('#to-interval').datepicker();

        this.deleteModalBtnElement = document.getElementById('deleteModalBtn');
    }

    private getIntervals(): void {
        const intervalsBtnsElement: HTMLElement | null = document.getElementById('operations-intervals');
        if (intervalsBtnsElement) {
            const intervalsBtns: NodeListOf<HTMLElement> = intervalsBtnsElement.querySelectorAll('.operations-interval');
            intervalsBtnsElement.addEventListener('click', (e) => {
                let element: HTMLElement | null = null;
                if (e.target && (e.target as HTMLElement).nodeName === 'BUTTON') {
                    element = e.target as HTMLElement;
                }
                if (element) {
                    intervalsBtns.forEach((interval: HTMLElement) => interval.classList.remove('active'));
                    element.classList.add('active');
                }
            });
        }

        const fromElement: HTMLElement | null = document.getElementById('from-interval');
        const toElement: HTMLElement | null = document.getElementById('to-interval');
        const todayBtn: HTMLElement | null = document.getElementById('today-btn');

        if (todayBtn) {
            todayBtn.onclick = (): void => {
                const todayDate: string = new Date().toISOString().split('T')[0];
                this.getOperations('interval&dateFrom=' + todayDate + '&dateTo=' + todayDate).then();
            }
        }

        const weekBtn: HTMLElement | null = document.getElementById('week-btn');
        if (weekBtn) weekBtn.onclick = () => this.getOperations('week');

        const monthBtn: HTMLElement | null = document.getElementById('month-btn');
        if (monthBtn) monthBtn.onclick = () => this.getOperations('month');

        const yearBtn: HTMLElement | null = document.getElementById('year-btn');
        if (yearBtn) yearBtn.onclick = () => this.getOperations('year');

        const allBtn: HTMLElement | null = document.getElementById('all-btn');
        if (allBtn) allBtn.onclick = () => this.getOperations('all');

        const intervalBtn: HTMLElement | null = document.getElementById('interval-btn');
        if (intervalBtn) intervalBtn.onclick = () => {
            this.getOperations('interval&dateFrom=' + (fromElement as HTMLInputElement).value + '&dateTo=' + (toElement as HTMLInputElement).value).then();
        }
    }

    private async getOperations(period: string): Promise<void> {

        const response: OperationsReturnObjectType = await OperationsService.getOperations(period);
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }

        this.showRecords(response.operations!);
    }

    showRecords(operations: OperationResponseType[]) {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (!recordsElement) {
            this.openNewRoute('/');
            return;
        }
        recordsElement.innerHTML = '';

        if (operations && operations.length > 0) {
            for (let i = 0; i < operations.length; i++) {
                const trElement: HTMLTableRowElement = document.createElement('tr');

                const thRowElement: HTMLTableCellElement = document.createElement('th');
                thRowElement.innerText = (i + 1).toString();
                thRowElement.setAttribute('scope', 'row');
                trElement.appendChild(thRowElement);

                const typeCell: HTMLTableCellElement = trElement.insertCell();
                typeCell.innerText = operations[i].type === 'expense' ? 'расход' : 'доход';
                typeCell.setAttribute('style', typeCell.innerText === 'расход' ? 'color: #DC3545;' : 'color: #198754');

                trElement.insertCell().innerText = operations[i].category ? operations[i].category.toLowerCase() : 'не назначена';
                trElement.insertCell().innerText = operations[i].amount + '$';

                const date: string[] = new Date(operations[i].date).toISOString().split('T')[0].split('-');
                trElement.insertCell().innerText = date[2] + '.' + date[1] + '.' + date[0];

                trElement.insertCell().innerText = operations[i].comment;
                trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('operations', operations[i].id);

                recordsElement.appendChild(trElement);

                document.getElementsByClassName('operations-delete')[i].addEventListener('click', () => {
                    if (this.deleteModalBtnElement) {
                        (this.deleteModalBtnElement as HTMLLinkElement).href = "/operations/delete?id=" + operations[i].id;
                    }
                })
            }
        }
    }
}