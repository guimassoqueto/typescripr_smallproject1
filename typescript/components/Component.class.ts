namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        templateElement: HTMLTemplateElement;
        hostElement: T;
        contentElement: U;
    
        constructor(templateID: string, hostID: string, insertAtStart: boolean, contentID?: string) {
            this.templateElement = document.getElementById(templateID)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostID)! as T;
    
            const importedNode: DocumentFragment = document.importNode(this.templateElement.content, true);
            this.contentElement = importedNode.firstElementChild as U;
    
            if (contentID) this.contentElement.id = `${contentID}`;
    
            this.attach(insertAtStart);
        }
    
        private attach(insertAtStart: boolean) {
            this.hostElement.insertAdjacentElement(`${insertAtStart ? 'afterbegin': 'beforeend'}`, this.contentElement);
        }
    
        abstract configure(): void;
    
        abstract renderContent(): void;
    }
}