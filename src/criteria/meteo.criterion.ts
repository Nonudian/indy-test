import fetch from 'node-fetch';
import { MeteoConditions, MeteoResponse, PropertyMapping, ValidationStatus } from '../types';


// CONDITION MAPPING
const temperatureMapping: Record<string, PropertyMapping> = {
    lt: {
        compare: (current: number, condition: number) => current < condition,
        failure: 'isNotLt'
    },
    gt: {
        compare: (current: number, condition: number) => current > condition,
        failure: 'isNotGt'
    }
};

// CHECKING FUNCTION
export async function meteoChecking({ is, temp: tempConditions }: MeteoConditions, town: string): Promise<ValidationStatus> {

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=bf2e6745b314f9e6f9bf3cab81fe337f&units=metric`);
    if (!response.ok) return { valid: false, error: 'fetchDoesntWork', context: 'meteo' };

    const { weather: [{ description }], main: { temp } } = await response.json() as MeteoResponse;

    if (!!is && !description.includes(is)) return { valid: false, error: `isNot${is}`, context: 'meteo' };

    for (const condition in tempConditions) {
        if (!temperatureMapping[condition].compare(temp, tempConditions[condition]))
            return { valid: false, error: temperatureMapping[condition].failure, context: 'meteo' };
    }

    return { valid: true };
}