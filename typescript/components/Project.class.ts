import { ProjectType } from '../models/enums';

export class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectType
    ){}
}