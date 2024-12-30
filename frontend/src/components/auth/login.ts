import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {FormFieldType} from "../../types/auth-types/form-field.type";
import {LoginResponseType} from "../../types/auth-types/login-response.type";

export class Login {
    readonly openNewRoute: Function;

    readonly rememberMeElement: HTMLElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    readonly headerElement: HTMLElement | null = null;
    private fields: FormFieldType[] = [];

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.headerElement = document.getElementById('header');

        if (this.headerElement) {
            this.headerElement.style.display = 'none';
        }

        document.getElementById('process-button')?.addEventListener('click', this.login.bind(this));

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        const that: Login = this;
        this.fields.forEach((item: FormFieldType): void => {
            item.element = document.getElementById(item.id)? (document.getElementById(item.id) as HTMLInputElement) : null;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }
        })
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (element.value && field.regex && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }
    }

    private validateForm(): boolean {
        return this.fields.every((item: FormFieldType) => item.valid);
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validateForm()) {

            const loginResult: LoginResponseType | null = await AuthService.logIn({
                email: this.fields.find(item => item.name === 'email')?.element?.value,
                password: this.fields.find(item => item.name === 'password')?.element?.value,
                rememberMe: this.rememberMeElement? (this.rememberMeElement as HTMLInputElement).checked : false
            });

            if (loginResult) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, (loginResult as LoginResponseType).tokens.refreshToken,
                        {
                            id: loginResult.user.id,
                            name: loginResult.user.name,
                            lastName: loginResult.user.lastName
                        });

                    this.openNewRoute('/');
                    return;
            }

            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }

        } else {
            this.fields.forEach((item: FormFieldType): void => {
                this.validateField(item, item.element as HTMLInputElement);
            })
        }
    }
}