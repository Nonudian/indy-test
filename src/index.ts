import { ageChecking } from './criteria/age.criterion';
import { dateChecking } from './criteria/date.criterion';
import { meteoChecking } from './criteria/meteo.criterion';
import { orChecking } from './operators/or.operator';
import type { AgeConditions, DateConditions, MeteoConditions, PromoCode, ReductionInput, ReductionResponse } from './types';


// We consider that both "name" and "promocode_name" are the same when we call this function
export async function askReduction(
    { arguments: inputArgs }: ReductionInput,
    { name, avantage, restrictions }: PromoCode
): Promise<ReductionResponse> {

    const argMapping = {
        '@age': async (condition: AgeConditions) => ageChecking(condition, inputArgs.age),
        '@date': async (condition: DateConditions) => dateChecking(condition),
        '@meteo': async (condition: MeteoConditions) => meteoChecking(condition, inputArgs.meteo.town)
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

        const { valid, error, context } = await argMapping[prop](restrictions[prop]);
        if (!valid) {
            return {
                promocode_name: name,
                reasons: {
                    [context!]: error
                },
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