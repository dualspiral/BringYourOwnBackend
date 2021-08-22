class Product {

    readonly id: string;
    readonly title: string;
    readonly blurb: string;
    readonly featured: boolean;

    constructor(id: string, json: any) {
        this.id = id;
        this.title = json.title || id;
        this.blurb = json.blurb || "";
        this.featured = json.featured || false;
    }
}

// Entry point into BYOB
class App {

    readonly DOWNLOAD_TARGET_ATTRIBUTE = "data-download-id";

    readonly HOME_ID: string = "home";
    readonly DOWNLOADS_ID: string = "downloads";
    readonly HOME_BUTTONS: string = `#home button[${this.DOWNLOAD_TARGET_ATTRIBUTE}]`;
    readonly RETURN_LINKS: string = "[data-reset]";
    readonly DOWNLOADS_TITLE: string = "#downloads .platform-logo > h2";
    readonly DOWNLOADS_LOADED_SELECTOR: string = "#downloads > .listed-downloads";
    readonly DOWNLOADS_LOADING_SELECTOR: string = "#downloads > .loading";
    readonly PRODUCTS: Map<string, Product> = new Map();

    readonly HOME_ELEMENT: HTMLElement = document.getElementById(this.HOME_ID);
    readonly DOWNLOADS_ELEMENT: HTMLElement = document.getElementById(this.DOWNLOADS_ID);
    readonly LOADING_ELEMENT: HTMLElement = document.querySelector(this.DOWNLOADS_LOADING_SELECTOR);
    readonly LOADED_ELEMENT: HTMLElement = document.querySelector(this.DOWNLOADS_LOADED_SELECTOR);

    constructor(json: any) {
        Object.entries(json).forEach(entry => {
            const [id, val] = entry;
            this.PRODUCTS.set(id, new Product(id, val));
        });
    }

    completeInitialisation() {
        // register the buttons
        const buttons: NodeListOf<HTMLElement> = document.querySelectorAll(this.HOME_BUTTONS);
        buttons.forEach(button => {
            button.addEventListener("click", e => {
                const target = e.target as HTMLElement;
                // get the attribute
                const targetId: string = target.getAttribute(this.DOWNLOAD_TARGET_ATTRIBUTE);
                if (targetId) {
                    this.initialiseDownloadPage(targetId);
                }
            });
        });

        const homeLink: NodeListOf<HTMLElement> = document.querySelectorAll(this.RETURN_LINKS);
        homeLink.forEach(link => {
            link.addEventListener("click", e => {
                this.returnToHomePage();
            })
        })

    }

    returnToHomePage(): void {
        this.DOWNLOADS_ELEMENT.style.display = "none";
        this.HOME_ELEMENT.style.display = "block";
    }

    switchToLoading() {
        this.DOWNLOADS_ELEMENT.style.display = "block";
        this.LOADING_ELEMENT.style.display = "block";
        this.LOADED_ELEMENT.style.display = "block";
        this.HOME_ELEMENT.style.display = "none";
    }

    initialiseDownloadPage(id: string): void {
        const product: Product = this.PRODUCTS.get(id) || new Product(id, {});
        (document.querySelector(this.DOWNLOADS_TITLE) as HTMLElement).innerHTML = product.title;
        this.switchToLoading();
    }

    renderDownloads(dataToRender) {

    }

}

// This will be properly populated via Gulp
const APP: App = new App("@product");
APP.completeInitialisation();