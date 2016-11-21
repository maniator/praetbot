interface Command {
    name: string;
    description?: string;
    execute?: Function;
    value?: string;
    respond?: string;
}

export { Command };
