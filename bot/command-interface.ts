interface Command {
    name: string;
    description?: string;
    execute?: Function;
    respond?: string;
}

export { Command };
