import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {FormFieldType} from "../../types/auth-types/form-field.type";
import {SignupResponseType} from "../../types/auth-types/signup-response.type";

export class SignUp {
    readonly openNewRoute: Function;

    readonly passwordElement: HTMLElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    readonly headerElement: HTMLElement | null = null;
    private fields: FormFieldType[] = [];

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.passwordElement = document.getElementById('password');
        this.commonErrorElement = document.getElementById('common-error');
        this.headerElement = document.getElementById('header');

        if (this.headerElement) {
            this.headerElement.style.display = 'none';
        }

        document.getElementById('process-button')?.addEventListener('click', this.signUp.bind(this));

        this.fields = [
            {
                name: 'fio',
                id: 'fio',
                element: null,
                regex: /^([A-ЯЁ][а-яё]+\s)+[A-ЯЁ][а-яё]+$/,
                valid: false,
            },
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
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element: null,
                regex: null,
                valid: false,
            }
        ];

        const that: SignUp = this;
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) ? (document.getElementById(item.id) as HTMLInputElement) : null;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            } else {
                alert('Возникла ошибка при загрузке данных. Обратитесь в поддержку');
                return;
            }
        })
    }

    private validateField(field: FormFieldType, element:HTMLInputElement): void {
        if (field.name === 'repeat-password') {
            if (element.value && element.value === (this.passwordElement as HTMLInputElement).value) {
                element.classList.remove('is-invalid');
                field.valid = true;
            } else {
                element.classList.add('is-invalid');
                field.valid = false;
            }
        } else if (element.value && field.regex && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }
    }

    private validateForm(): boolean {
        return this.fields.every((item: FormFieldType): boolean => item.valid);
    }

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validateForm()) {

            const signupResult: SignupResponseType | null = await AuthService.signUp({
                name: this.fields.find(item => item.name === 'fio')?.element?.value.split(' ').slice(1).join(' '),
                lastName: this.fields.find(item => item.name === 'fio')?.element?.value.split(' ', 1)[0],
                email: this.fields.find(item => item.name === 'email')?.element?.value,
                password: this.fields.find(item => item.name === 'password')?.element?.value,
                passwordRepeat: this.fields.find(item => item.name === 'repeat-password')?.element?.value,
            });

            if (signupResult) {
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