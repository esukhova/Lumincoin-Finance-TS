import {Main} from "./components/main";
import {SignUp} from "./components/auth/signup";
import {Login} from "./components/auth/login";
import {Operations} from "./components/operations/operations";
import {Categories} from "./components/categories/categories";
import {CategoriesEdit} from "./components/categories/categories-edit";
import {CategoriesCreate} from "./components/categories/categories-create";
import {OperationsCreate} from "./components/operations/operations-create";
import {OperationsEdit} from "./components/operations/operations-edit";
import {Layout} from "./components/layout";
import {Logout} from "./components/auth/logout";
import {FileUtils} from "./utils/file-utils";
import {OperationsDelete} from "./components/operations/operations-delete";
import {CategoriesDelete} from "./components/categories/categories-delete";
import {AuthUtils} from "./utils/auth-utils";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/auth-types/user-info.type";
import {AuthType} from "./types/auth-types/auth.type";
import {OperationsTypesType} from "./types/operations-types/operations-types.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    readonly firstScriptElement: HTMLElement | null;
    private userNameElement: HTMLElement | null = null;
    private userName: string | null;
    private routes: RouteType[];

    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.firstScriptElement = document.getElementById('firstScriptElement');
        this.userName = null;

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new Main(this.openNewRoute.bind(this));

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    document.body.classList.add('login-page');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                load: () => {
                    document.body.classList.add('signup-page');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('signup-page');
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/operations.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                useLayout: '/templates/layout.html',
                styles: ['jquery-ui.min.css'],
                scripts: ['jquery-3.7.1.min.js', 'jquery-ui.min.js'],
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/categories/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/categories/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Categories(this.openNewRoute.bind(this), OperationsTypesType.expense);
                }
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/categories/expense-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesEdit(this.openNewRoute.bind(this), OperationsTypesType.expense);
                }
            },
            {
                route: '/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/categories/expense-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesCreate(this.openNewRoute.bind(this), OperationsTypesType.expense);
                }
            },
            {
                route: '/categories/expense/delete',
                load: () => {
                    new CategoriesDelete(this.openNewRoute.bind(this), OperationsTypesType.expense);
                }
            },
            {
                route: '/categories/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/categories/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Categories(this.openNewRoute.bind(this), OperationsTypesType.income);
                }
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/categories/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesEdit(this.openNewRoute.bind(this), OperationsTypesType.income);
                }
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/categories/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoriesCreate(this.openNewRoute.bind(this), OperationsTypesType.income);
                }
            },
            {
                route: '/categories/income/delete',
                load: () => {
                    new CategoriesDelete(this.openNewRoute.bind(this), OperationsTypesType.income);
                }
            },
        ]
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }


    private async clickHandler(e: Event | null): Promise<void> {
        let element: HTMLElement | ParentNode | null = null;
        if (e && e.target) {
            if ((e.target as HTMLElement).nodeName === 'A') {
                element = e.target as HTMLElement;
            } else if ((e.target as HTMLElement).parentNode?.nodeName === 'A') {
                element = (e.target as HTMLElement).parentNode;
            }

            if (!element) {
                return;
            }

            e.preventDefault();

            const url: string = (element as HTMLLinkElement).href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript: void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (!this.contentPageElement) {
            await this.openNewRoute('/');
            return;
        }

        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles.length > 0) {
                    currentRoute.styles.forEach((style: string): void => {
                        document.querySelector(`link[href='/css/${style}']`)?.remove();
                    })
                }
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach((script: string): void => {
                        document.querySelector(`script[src='/js/${script}']`)?.remove();
                    })
                }
                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }

        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            console.log('No route found');
            history.pushState({}, '', '/');
            await this.activateRoute(null, null);
            return;
        }

        if (newRoute.styles && newRoute.styles.length > 0) {
            newRoute.styles.forEach((style: string): void => {
                FileUtils.loadPageStyle('/css/' + style, this.firstScriptElement);
            })
        }
        if (newRoute.scripts && newRoute.scripts.length > 0) {
            for (const script of newRoute.scripts) {
                await FileUtils.loadPageScript('/js/' + script);
            }
        }

        if (newRoute.title) {
            if (this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }
        }

            if (newRoute.filePathTemplate) {
                document.body.className = '';
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    new Layout(this.openNewRoute.bind(this));
                    contentBlock = document.getElementById('content-layout');
                    this.activateMenuItem(newRoute);

                    let userInfoString: string | AuthType | null = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                    if (typeof userInfoString === 'string') {
                        let userInfo: UserInfoType = JSON.parse(userInfoString);
                        if (userInfo.lastName && userInfo.name) {
                            this.userName = userInfo.lastName + ' ' + userInfo.name;
                            this.userNameElement = document.getElementById('user-name');
                            if (this.userNameElement) {
                                this.userNameElement.innerText = this.userName;
                            }
                        }
                    }
                }

                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

    }

    private activateMenuItem(route: RouteType): void {
        const accordionBtn: Element = document.getElementsByClassName('accordion-button')[0];
        const accordionCollapse: Element = document.getElementsByClassName('accordion-collapse')[0];
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href: string | null = item.getAttribute('href');
            if (href) {
                if ((route.route.includes(href) && href !== '/') || (route.route === href && href === '/')) {
                    item.classList.add('active');
                    if (route.route.includes('categories')) {
                        accordionBtn.classList.add('active');
                        accordionBtn.classList.remove('collapsed');
                        accordionCollapse.classList.add('show');
                    }
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }
}