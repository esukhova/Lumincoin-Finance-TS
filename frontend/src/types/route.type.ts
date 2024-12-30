export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string,
    styles?: string[],
    scripts?: string[],
    load(): void,
    unload?(): void
}
