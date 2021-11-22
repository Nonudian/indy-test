import moment from 'moment';


/* We consider that both "name" and "promocode_name" are the same when we call this function */
export async function askReduction(askReductionInput: ReductionInput, promoCode: PromoCode): Promise<ReductionResponse> {

    const { promocode_name, arguments: { age } } = askReductionInput;
    const { avantage, restrictions } = promoCode;

    const argMapping: Record<string, (...args: any) => boolean> = {
        '@age': (args: AgeCondition) => {
            return (!!args['eq'] && args['eq'] === age)
                || (args['gt'] < age && age < args['lt']);
        },
        '@date': ({ after, before }: DateCondition) => {
            const afterCondition = !!after && moment().isAfter(moment(after));
            const beforeCondition = !!before && moment().isBefore(moment(before));

            if (!!after && !!before) return afterCondition && afterCondition;
            if (!!after) return afterCondition;
            else return beforeCondition;
        }
    };

    for (const prop in restrictions) {
        if (prop === '@or') continue;

        const valid = argMapping[prop](restrictions[prop]);
        if (!valid) {
            return {
                promocode_name,
                status: 'denied',
                reasons: {}
            };
        }
    }

    return {
        promocode_name,
        status: 'accepted',
        avantage
    };
};

askReduction(
    {
        "promocode_name": "WeatherCode",
        "arguments": {
            "age": 25,
            "meteo": { "town": "Lyon" }
        }
    },
    {
        "_id": "...",
        "name": "WeatherCodeBis",
        "avantage": { "percent": 30 },
        "restrictions": {
            "@or": [
                {
                    "@age": {
                        "eq": 40
                    }
                },
                {
                    "@date": {
                        "after": "2020-01-01",
                        "before": "2029-01-01"
                    }
                },
                {
                    "@date": {
                        "after": "2099-01-01"
                    }
                }
            ],
            "@age": {
                "lt": 30,
                "gt": 15
            },
            "@date": {
                "after": "2019-01-01",
                "before": "2020-06-30"
            },
        }
    });