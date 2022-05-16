namespace App {
    export type Listener<T> = (items: T[]) => void;

    export type ProjectObject = {
        id: string;
        title: string;
        description: string;
        people: number;
    }
}