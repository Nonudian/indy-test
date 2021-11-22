import { ageChecking } from './criteria/age.criterion';
import { dateChecking } from './criteria/date.criterion';
import { meteoChecking } from './criteria/meteo.criterion';
import type { AgeConditions, DateConditions, MeteoConditions, PromoCode, ReductionInput, ReductionResponse, ValidationStatus } from './types';


// We consider that both "name" and "promocode_name" are the same when we call this function
export async function askReduction({ arguments: inputArgs }: ReductionInput, { name, avantage, restrictions }: PromoCode): Promise<ReductionResponse> {

    const conditionMapping: Record<string, (...conditions: any[]) => Promise<ValidationStatus>> = {
        '@age': async (condition: AgeConditions) => ageChecking(condition, inputArgs.age),
        '@date': async (condition: DateConditions) => dateChecking(condition),
        '@meteo': async (condition: MeteoConditions) => meteoChecking(condition, inputArgs.meteo.town)
    };

    const { '@or': orConditions, ...andConditions } = restrictions;

    // if all AND conditions are valid
    for (const condition in andConditions) {
        const { valid, error, context } = await conditionMapping[condition](restrictions[condition]);
        if (!valid) {
            return {
                promocode_name: name,
                reasons: { [context!]: error! },
                status: 'denied'
            };
        }
    }

    // then we can check for OR conditions
    const isValid = async () => {
        if (!orConditions) return true;

        for (const condition of orConditions) {
            const conditionName = Object.keys(condition)[0];

            if ((await conditionMapping[conditionName](condition[conditionName])).valid) return true;
        }

        return false;
    };

    // if all OR conditions are falsy, there is a problem with data
    if (!await isValid()) {
        return {
            promocode_name: name,
            reasons: { or: 'isNotValid' },
            status: 'denied'
        };
    }

    //otherwise, that's all OK!
    return {
        avantage,
        promocode_name: name,
        status: 'accepted'
    };
};