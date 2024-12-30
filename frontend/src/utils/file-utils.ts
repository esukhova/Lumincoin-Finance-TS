export class FileUtils {

    public static loadPageScript(src: string): Promise<string> {
        return new Promise((resolve, reject): void => {
            const script: HTMLScriptElement = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        });
    }

    public static loadPageStyle(src: string, insertBeforeElement: HTMLElement | null): void {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        if (insertBeforeElement) {
            document.head.insertBefore(link, insertBeforeElement);
        } else {
            document.head.appendChild(link);
        }
    }
}