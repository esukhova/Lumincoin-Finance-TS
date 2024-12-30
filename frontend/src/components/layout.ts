import {BalanceService} from "../services/balance-service";
import {BalanceReturnObjectType} from "../types/balance-returnObject.type";
import {AuthUtils} from "../utils/auth-utils";

export class Layout {
    readonly openNewRoute: Function;
    readonly balance: HTMLElement | null = null;
    readonly balanceInput: HTMLElement | null = null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        const sidebarElement: HTMLElement | null = document.getElementById('sidebar-layout');
        const burgerElement: HTMLElement | null = document.getElementById('burger');

        if (burgerElement) {
            burgerElement.classList.remove("active");
            burgerElement.addEventListener("click", () => {
                if (sidebarElement && sidebarElement.classList.contains("show")) {
                    burgerElement.classList.add("active");
                } else {
                    burgerElement.classList.remove("active");
                }
                if (burgerElement.classList.contains("active")) {
                    burgerElement.classList.remove("active");
                } else {
                    burgerElement.classList.add("active");
                }
            });

            document.addEventListener("click", (e) => {
                if (e.target && (e.target as HTMLElement).className === 'offcanvas-backdrop fade') {
                    burgerElement.classList.remove("active");
                }
            });
        }

        this.balance = document.getElementById('balance-span');
        this.balanceInput = document.getElementById('balance-input');

        this.getBalance().then();

        document.getElementById('balanceModalBtn')?.addEventListener('click', this.updateBalance.bind(this));
    }

    private async getBalance(): Promise<void> {

        const response = await BalanceService.getBalance();
        if (response.error) {
            alert(response.error);
            if (response.redirect) {
                this.openNewRoute(response.redirect);
            }
            return;
        }
        if (this.balance && response.balance) {
            this.balance.innerText = response.balance.toString();
        }
        if (this.balanceInput && response.balance) {
            (this.balanceInput as HTMLInputElement).value = response.balance.toString();
        }
    }

    private async updateBalance(): Promise<void> {
        if (!this.balanceInput || !this.balance) return;

        let updateData: { newBalance: number } | null = null;

        if ((this.balanceInput as HTMLInputElement).value !== this.balance.innerText) {
            updateData = {
                newBalance: Number((this.balanceInput as HTMLInputElement).value)
            }
        }

        if (updateData) {
            const response: BalanceReturnObjectType = await BalanceService.updateBalance(updateData);
            if (response.error) {
                alert(response.error);
                if (response.redirect) {
                    this.openNewRoute(response.redirect);
                }
                return;
            }

            if (response.balance) {
                this.balance.innerText = response.balance.toString();
            }
            return;
        }
    }
}