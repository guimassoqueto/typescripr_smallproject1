import { Component } from '../components/Component.class.js'; 
import { DragAndDrop } from '../models/interfaces.js';
import { Project } from './Project.class.js';
import { ProjectItem } from './ProjectItem.class.js';
import { project_state } from '../state/State.class.js';
import { ProjectType } from '../models/enums.js';
import { autobind } from '../decorators/autobind.js';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragAndDrop{
    assignedProjects: Project[]; 

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        //templateID: string, hostID: string, insertAtStart: boolean, contentID?: string
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    private renderProjects() {
        const list_element = <HTMLUListElement>document.getElementById(`${this.type}-projects-list`);
        list_element.innerText = ''
        for (const project_item of this.assignedProjects) {
            new ProjectItem(this.contentElement.querySelector('ul')!.id, project_item)
        }
    }

    renderContent() {
        this.contentElement.querySelector('ul')!.id = `${this.type}-projects-list`;
        this.contentElement.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }

    configure() {
        this.contentElement.addEventListener('dragover', this.dragOverHandler);
        this.contentElement.addEventListener('dragleave', this.dragLeaveHandler);
        this.contentElement.addEventListener('drop', this.dropHandler);

        project_state.addListener((projects: Project[]) => {
            const relevant_projects: Project[] = projects.filter(project => {
                if (this.type === ProjectType.ACTIVE) return project.status === ProjectType.ACTIVE
                else return project.status === ProjectType.FINISHED
            })
            this.assignedProjects = relevant_projects;
            this.renderProjects()
        })
    }

    @autobind
    dragOverHandler(_: DragEvent): void {
        const list_element = this.contentElement.querySelector('ul')!;
        list_element.classList.add('droppable');
    }

    @autobind
    dropHandler(_: DragEvent): void {
        
    }
    
    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const list_element = this.contentElement.querySelector('ul')!;
        list_element.classList.remove('droppable');
    }
}
