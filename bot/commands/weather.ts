import { User } from '../command-interface';

const fetch = require('node-fetch');
const weatherAppId = process.env.WEATHER_KEY;
const weatherAPI = 'http://api.openweathermap.org/data/2.5/weather';

const weather = {
    latlon: function (lat : string, lon : string) : Promise<string | void> {
        const nlat = Number(lat),
            nlon = Number(lon);
        const errs : any[] = [];

        if (nlat < -180 || nlat > 180) {
            errs.push('Latitude must be between -180 and 180');
        }
        if (nlon < -180 || nlon > 180) {
            errs.push('Longitude must be between -180 and 180');
        }


        if (errs.length) {
            return Promise.reject(errs.join(', '));
        }

        return fetch(`${weatherAPI}?appid=${weatherAppId}&lat=${lat}&lon=${lon}&cnt=1`)
            .then((res : any) => res.json())
            .then((data : any) => this.format(data));
    },

    city: function (city : string) : Promise<string> {
        return fetch(`${weatherAPI}?appid=${weatherAppId}&q=${city}&cnt=1`)
            .then((res : any) => res.json())
            .then((data : any) => this.format(data));
    },

    format: function (resp : any) : string {
        var main = resp.main;

        if (!main) {
            console.error(resp);
            return 'Sorry, I couldn\'t get the data: ' + resp.message;
        }

        return this.formatter(resp);
    },
    formatter: function (data : any) : string {
        var temps = data.main,
            ret : string = '';

        temps.celsius = (Number(temps.temp - 273.15)).toFixed(1);
        temps.fahrenheit = (Number(temps.temp * 9 / 5 - 459.67)).toFixed(1);

        ret += `${temps.fahrenheit}F (${temps.celsius}C)`;

        var descs = (data.weather || []).map(function (w : any) {
            return w.description;
        }).join(', ');

        if (descs) {
            ret += ', ' + descs;
        }

        return ret;
    }
};

const latlonRegex = /\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/;
function weatherCommand(args : string) : Promise<string> {
    var parts : RegExpExecArray = latlonRegex.exec(args);
    if (parts && parts.length >= 3) {
        return weather.latlon(parts[1], parts[2]);
    } else if (args.length) {
        return weather.city(args);
    }

    return Promise.resolve('See `!!help weather` for usage info');
}


module.exports = function (bot: any, channel: any, user: User, ...args : any[]) {
    weatherCommand(args.join(' ')).then(function (response) {
        bot.postMessage(channel.id, `@${user.name} ${response}`, { as_user: true });
    }).catch(function (error) {
        bot.postMessage(channel.id, `@${user.name} ${error}`, { as_user: true });
    });
};