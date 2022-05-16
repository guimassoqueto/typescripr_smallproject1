namespace App {
    export abstract class State<T>{
        protected listeners: Listener<T>[] = []
    
        addListener(listener_func: Listener<T>): void {
            this.listeners.push(listener_func);
        }
    }

    export class ProjectState extends State<Project>{
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
    
    export const project_state = ProjectState.getInstance();
}