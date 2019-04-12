import { User } from '../command-interface';
const fetch = require('node-fetch');
const sefariaAPI = 'http://www.sefaria.org/api/texts';

const sefaria = {
    loadRef: function (ref: string): Promise<string | void> {


        return fetch(`${sefariaAPI}/${ref}?commentary=0&context=0`)
            .then((res: any) => res.json())
            .then((data: any) => this.format(ref, data));
    },



    format: function (ref: string, data: any): string {
        //this function is terrible and should probably be ported to (and leverage) some common library
        //TODO: handle all sorts of possible bad formatting possibilities
        function cleanText(dirtyText: string): string {
            //replace html tags with slack-friendly tags
            dirtyText = dirtyText.replace(/<i>/g, "_").replace(/<\/i>/g, "_").replace(/<b>/g, "*").replace(/<\/b>/g, "*");

            //these are probably empty tags
            return dirtyText.replace(/__/g, "").replace(/\*\*/g, "_");

        }

        function formatTextResult(inText: any, notFound: string): string {
            var outText: string = notFound;

            if (inText) {
                //technically, according to sefaria docs this should be predictable - but I vaguely remember there being bugs with that
                //doesn't hurt to handle either case
                if (Array.isArray(inText)) {
                    outText = inText.join(' ');
                } else {
                    outText = inText;
                }
            }

            return cleanText(outText);
        }

        var msg = `Results for *${ref}*\n\n`;

        msg += "English: " + formatTextResult(data.text, "Not Found") + '\n';
        msg += "Hebrew: " + formatTextResult(data.he, "לא נמצא");

        return msg;
    },

    getRefFromInput: function (args: any[]) {
        var ref: string = "";

        if (args && args.length) {
            ref = args.join(' ');
        }
        return ref;
    }
};

module.exports = function (bot: any, channel: any, user: User, ...args: any[]) {

    var ref = sefaria.getRefFromInput(args);

    if (ref.length) {
        sefaria.loadRef(ref).then(function (response) {
            bot.postMessage(channel.id, `@${user.name} ${response}`, { as_user: true });
        }).catch(function (error) {
            bot.postMessage(channel.id, `@${user.name} ${error}`, { as_user: true });
        });
    } else {
        bot.postMessage(channel.id, `@${user.name} Need to provide a REF!`, { as_user: true });
    }


};