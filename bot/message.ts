interface Message {
    type: string;
    text: string;
    channel: string;
    user: string;
    group: any;
}

export { Message };
