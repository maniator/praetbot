interface Command {
    _id?: string;
    name: string;
    description?: string;
    execute?: Function;
    value?: string;
    respond?: string;
}


interface User {
    name: string;
    id: string;
}


export { Command, User };
