interface Command {
    name: string;
    description?: string;
    execute?: Function;
    value?: string;
    respond?: string;
    description?: string;
}


interface User {
    name: string;
    id: string;
}


export { Command, User };
