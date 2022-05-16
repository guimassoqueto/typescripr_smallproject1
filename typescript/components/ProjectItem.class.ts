namespace App {
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
        private project: Project;
    
        get persons(): string {
            return this.project.people > 1 ? `${this.project.people} persons`: `1 person`
        }
    
        constructor(hostID: string, project: Project) {
            super('single-project', hostID, false, project.id)
            this.project = project;
    
            this.configure();
            this.renderContent()
        }
    
        configure(): void {
            this.contentElement.addEventListener('dragstart', this.dragStartHandler);
            this.contentElement.addEventListener('dragend', this.dragEndHandler);
        };
    
        renderContent(): void {
            this.contentElement.querySelector('h2')!.textContent = this.project.title;
            this.contentElement.querySelector('h3')!.textContent = `${this.persons} assigned.`;
            this.contentElement.querySelector('p')!.textContent = this.project.description;
        }
    
        @autobind
        dragStartHandler(event: DragEvent): void {
            console.log(event);
        }
    
        @autobind
        dragEndHandler(_: DragEvent): void {
            console.log('drag end');
        }
    }
}