import { Component } from '../components/Component.class.js'; 
import { autobind } from '../decorators/autobind.js';
import { project_state } from '../state/State.class.js';

interface UserInput {
    title: string;
    description: string;
    people: number;
};

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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
