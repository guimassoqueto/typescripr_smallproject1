function autobind(_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      }
    };
    return adjDescriptor;
}

interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragAndDrop {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}


interface UserInput {
    title: string;
    description: string;
    people: number;
};
enum ProjectType {
    ACTIVE = 'active',
    FINISHED = 'finished'
}
type ProjectObject = {
    id: string;
    title: string;
    description: string;
    people: number;
}
type Listener<T> = (items: T[]) => void;


class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectType
    ){}
}


abstract class State<T>{
    protected listeners: Listener<T>[] = []

    addListener(listener_func: Listener<T>): void {
        this.listeners.push(listener_func);
    }
}


class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    constructor() {
        super();
    }

    static getInstance(): ProjectState {
        if (this.instance) return this.instance;
        
        this.instance = new ProjectState();

        return this.instance;
    }

    addProject(title: string, description: string, num_of_people: number): void {
        const new_project: Project = new Project(
            Math.random().toString(), 
            title, 
            description, 
            num_of_people, 
            ProjectType.ACTIVE
        )

        this.projects.push(new_project);

        for (const listener of this.listeners) {
            listener([...this.projects]);
        }

    }
}
const project_state = ProjectState.getInstance();


abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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


class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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


class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragAndDrop{
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


class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    private title_input: HTMLInputElement;
    private description_input: HTMLInputElement;
    private people_input: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input')

        // const importedNode: DocumentFragment = document.importNode(this.templateElement.content, true);

        this.title_input = this.contentElement.querySelector('#title')! as HTMLInputElement;
        this.description_input = this.contentElement.querySelector('#description')! as HTMLInputElement;
        this.people_input = this.contentElement.querySelector('#people')! as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.contentElement.addEventListener('submit', this.submitHandler);
    }

    renderContent(): void {}

    @autobind
    private submitHandler(event: Event): void {
        event.preventDefault();
        
        const user_input: UserInput | void = this.gatherUserInput();

        if (!user_input) {
            alert('Invalid Input');
            return;
        }

        project_state.addProject(user_input.title, user_input.description, user_input.people)

        this.clearInputs();
    }

    private gatherUserInput(): UserInput | void {
        const user_input: UserInput = {
            title: this.title_input.value.trim(),
            description: this.description_input.value.trim(),
            people: +this.people_input.value.trim()
        }

        if (!user_input.title || !user_input.description || !user_input.people) {
            return;
        }

        return user_input;
    }

    private clearInputs() {
        this.title_input.value = '';
        this.description_input.value = '';
        this.people_input.value = '';
    }

}

const project_input = new ProjectInput();
const project_list_active = new ProjectList('active');
const project_list_finished = new ProjectList('finished');