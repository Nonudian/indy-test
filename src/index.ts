import moment from 'moment';
import fetch from 'node-fetch';

import type {
    ReductionInput,
    PromoCode,
    ReductionResponse,
    OrCondition,
    AgeCondition,
    DateCondition,
    MeteoCondition,
    MeteoResponse
} from './types';


async function orChecking(restrictions: OrCondition, argMapping: Record<string, (...args: any) => Promise<boolean>>): Promise<boolean> {
    for (let property of restrictions) {
        const propertyName = Object.keys(property)[0];
        if (await argMapping[propertyName](property[propertyName])) return true;
    }
    return false;
}

/* We consider that both "name" and "promocode_name" are the same when we call this function */
export async function askReduction({ arguments: inputArgs }: ReductionInput, { name, avantage, restrictions }: PromoCode): Promise<ReductionResponse> {

    const argMapping: Record<string, (...args: any) => Promise<boolean>> = {
        '@age': async (args: AgeCondition) => {
            const { age } = inputArgs;

            return (!!args['eq'] && args['eq'] === age)
                || (args['gt'] < age && age < args['lt']);
        },
        '@date': async ({ after, before }: DateCondition) => {
            const afterCondition = !!after && moment().isAfter(moment(after));
            const beforeCondition = !!before && moment().isBefore(moment(before));

            if (!!after && !!before) return afterCondition && beforeCondition;
            if (!!after) return afterCondition;
            return beforeCondition;
        },
        '@meteo': async ({ is, temp: { lt, gt } }: MeteoCondition) => {
            const { town } = inputArgs.meteo;

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=bf2e6745b314f9e6f9bf3cab81fe337f&units=metric`);
            if (!response.ok) throw new Error(response.statusText);

            const { weather: [{ description }], main: { temp } }: MeteoResponse = await response.json();

            if (!description.includes(is)) return false;

            const greaterThan = !!gt && parseFloat(gt) < temp;
            const lesserThan = !!lt && parseFloat(lt) > temp;

            if (!!gt && !!lt) return greaterThan && lesserThan;
            if (!!gt) return greaterThan;
            return lesserThan;
        }
    };

    for (const prop in restrictions) {
        if (prop === '@or') {
            const valid = await orChecking(restrictions[prop], argMapping);
            if (!valid) {
                return {
                    promocode_name: name,
                    reasons: {},
                    status: 'denied'
                };
            }
            continue;
        }

        const valid = await argMapping[prop](restrictions[prop]);
        if (!valid) {
            return {
                promocode_name: name,
                reasons: {},
                status: 'denied'
            };
        }
    }

    return {
        avantage,
        promocode_name: name,
        status: 'accepted'
    };
};


// askReduction(
//     {
//         "promocode_name": "WeatherCode",
//         "arguments": {
//             "age": 25,
//             "meteo": { "town": "Lyon" }
//         }
//     },
//     {
//         "_id": "...",
//         "name": "WeatherCodeBis",
//         "avantage": { "percent": 30 },
//         "restrictions": {
//             "@or": [
//                 {
//                     "@age": {
//                         "eq": 40
//                     }
//                 },
//                 {
//                     "@date": {
//                         "after": "2020-01-01",
//                         "before": "2029-01-01"
//                     }
//                 },
//                 {
//                     "@date": {
//                         "after": "2099-01-01"
//                     }
//                 }
//             ],
//             "@meteo": {
//                 is: "cloud",
//                 temp: {
//                     lt: "100",
//                 },
//             },
//             "@age": {
//                 "lt": 30,
//                 "gt": 15
//             },
//             "@date": {
//                 "after": "2019-01-01",
//                 "before": "2022-06-30"
//             },
//         }
//     }).then(response => console.log(response));