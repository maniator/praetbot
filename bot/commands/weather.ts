import { User } from '../command-interface.js';
import { Client, TextChannel, DMChannel } from 'discord.js';

const weatherAppId = process.env.WEATHER_KEY;
const weatherAPI = 'http://api.openweathermap.org/data/2.5/weather';

const weather = {
    latlon: async function (lat: string, lon: string): Promise<string> {
        const nlat = Number(lat);
        const nlon = Number(lon);
        const errs: any[] = [];

        if (nlat < -180 || nlat > 180) {
            errs.push('Latitude must be between -180 and 180');
        }
        if (nlon < -180 || nlon > 180) {
            errs.push('Longitude must be between -180 and 180');
        }

        if (errs.length) {
            throw new Error(errs.join(', '));
        }

        const res = await fetch(`${weatherAPI}?appid=${weatherAppId}&lat=${lat}&lon=${lon}&cnt=1`);
        const data = await res.json();
        return this.format(data);
    },

    city: async function (city: string): Promise<string> {
        const res = await fetch(`${weatherAPI}?appid=${weatherAppId}&q=${city}&cnt=1`);
        const data = await res.json();
        return this.format(data);
    },

    format: function (resp: any): string {
        const main = resp.main;

        if (!main) {
            console.error(resp);
            return 'Sorry, I couldn\'t get the data: ' + resp.message;
        }

        return this.formatter(resp);
    },
    
    formatter: function (data: any): string {
        const temps = data.main;
        let ret: string = '';

        const celsius = (Number(temps.temp - 273.15)).toFixed(1);
        const fahrenheit = (Number(temps.temp * 9 / 5 - 459.67)).toFixed(1);

        ret += `${fahrenheit}F (${celsius}C)`;

        const descs = (data.weather || []).map(function (w: any) {
            return w.description;
        }).join(', ');

        if (descs) {
            ret += ', ' + descs;
        }

        return ret;
    }
};

const latlonRegex = /\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/;

async function weatherCommand(args: string): Promise<string> {
    const parts: RegExpExecArray | null = latlonRegex.exec(args);
    if (parts && parts.length >= 3) {
        return weather.latlon(parts[1], parts[2]);
    } else if (args.length) {
        return weather.city(args);
    }

    return Promise.resolve('See `!!help weather` for usage info');
}

export default async function (bot: Client, channel: TextChannel | DMChannel, user: User, ...args: any[]): Promise<void> {
    try {
        const response = await weatherCommand(args.join(' '));
        await channel.send(`<@${user.id}> ${response}`);
    } catch (error) {
        await channel.send(`<@${user.id}> ${error}`);
    }
}
