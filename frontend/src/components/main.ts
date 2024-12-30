import Chart, {ChartData, ChartItem} from "chart.js/auto";
import {AuthUtils} from "../utils/auth-utils";
import {OperationsService} from "../services/operations-servise";
import {OperationsReturnObjectType} from "../types/operations-types/operations-returnObject.type";
import {OperationResponseType} from "../types/operations-types/operation-response.type";
import {OperationsTypesType} from "../types/operations-types/operations-types.type";
import {FractionsType} from "../types/fractions.type";


export class Main {
    readonly openNewRoute: Function;
    readonly header: HTMLElement | null = null;

    constructor(openNewRoute: Function) {

        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.header = document.getElementById('header');
        if (this.header) {
            this.header.style.display = 'flex';
        }

        this.getOperations('all').then();

        this.getIntervals();

        const datePicker: HTMLElement | null = document.getElementById('ui-datepicker-div');

        if (datePicker) {
            datePicker.remove();
        }

        $('#from-interval').datepicker();
        $('#to-interval').datepicker();
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

        if (response.operations) {
            this.getCharts(response.operations);
        }
    }

    private getCharts(operations: OperationResponseType[]): void {

        Chart.defaults.color = '000';
        Chart.defaults.borderColor = '#36A2EB';


        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

        let fractionsIncome: FractionsType[] = [];
        let fractionsExpense: FractionsType[] = [];

        for (let i = 0; i < operations.length; i++) {
            if (operations[i].type === OperationsTypesType.expense) {
                fractionsExpense.push({
                    category: operations[i].category,
                    amount: Number(operations[i].amount)
                });
            } else if (operations[i].type === OperationsTypesType.income) {
                fractionsIncome.push({
                    category: operations[i].category,
                    amount: Number(operations[i].amount)
                });
            }
        }

        let fractionsIncomeSums: { [key: string]: number } = {};
        let fractionsExpenseSums: { [key: string]: number } = {};

        for (let i = 0; i < fractionsIncome.length; i++) {
            if (!fractionsIncomeSums.hasOwnProperty(fractionsIncome[i].category)) {
                fractionsIncomeSums[fractionsIncome[i].category] = fractionsIncome[i].amount;
            } else if (fractionsIncomeSums.hasOwnProperty(fractionsIncome[i].category)) {
                fractionsIncomeSums[fractionsIncome[i].category] = (fractionsIncomeSums[fractionsIncome[i].category] + fractionsIncome[i].amount);
            }
        }
        for (let i = 0; i < fractionsExpense.length; i++) {
            if (!fractionsExpenseSums.hasOwnProperty(fractionsExpense[i].category)) {
                fractionsExpenseSums[fractionsExpense[i].category] = fractionsExpense[i].amount;
            } else if (fractionsExpenseSums.hasOwnProperty(fractionsExpense[i].category)) {
                fractionsExpenseSums[fractionsExpense[i].category] = (fractionsExpenseSums[fractionsExpense[i].category] + fractionsExpense[i].amount);
            }
        }

        const labelsIncome: string[] = Object.keys(fractionsIncomeSums);
        const labelsExpense: string[] = Object.keys(fractionsExpenseSums);

        const backgroundColor: string[] = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD', '#DC3545', '#FF69B4', '#00FF00', '#00FFFF', '#9400D3', '#FFDEAD', '#FF3333', '#CC6600', '#FFFF99', '#339933', '#333399'];


        const dataIncome: ChartData = {
            labels: labelsIncome,
            datasets: [
                {
                    label: 'Доходы',
                    data: Object.values(fractionsIncomeSums),
                    backgroundColor: backgroundColor,
                }
            ],
        };
        const dataExpense: ChartData = {
            labels: labelsExpense,
            datasets: [
                {
                    label: 'Расходы',
                    data: Object.values(fractionsExpenseSums),
                    backgroundColor: backgroundColor,
                }
            ],
        };

        const options = {
            plugins: {
                legend: {
                    position: 'top' as const,
                    labels: {
                        font: {
                            size: 12,
                            weight: 'bold' as const
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Доходы',
                    font: {
                        size: 28,
                        padding: {
                            bottom: 20
                        }
                    },
                    color: '#290661'
                },
            },
        };

        if (Chart.getChart("chart-income")) {
            Chart.getChart("chart-income")?.destroy();
        }
        if (Chart.getChart("chart-expense")) {
            Chart.getChart("chart-expense")?.destroy();
        }

        const chartIncomeElement: HTMLCanvasElement | null = <HTMLCanvasElement>document.getElementById('chart-income');
        if (chartIncomeElement) {
            const chartIncome = new Chart(chartIncomeElement as ChartItem, {
                type: 'pie',
                data: dataIncome,
                options: options
            });
        }

        options.plugins.title.text = 'Расходы';

        const chartExpenseElement: HTMLCanvasElement | null = <HTMLCanvasElement>document.getElementById('chart-expense');
        if (chartExpenseElement) {
        const chartExpense = new Chart(chartExpenseElement as ChartItem, {
            type: 'pie',
            data: dataExpense,
            options: options
        });
    }
        }
}