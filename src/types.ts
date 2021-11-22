export interface ReductionInput {
    promocode_name: string;
    arguments: {
        age: number;
        meteo: {
            town: string;
        };
    };
}

export interface PromoCode {
    _id?: string;
    name: string;
    avantage: {
        percent: number;
    };
    restrictions: { '@or': OrCondition; } | { '@age': AgeCondition; } | { '@date': DateCondition; } | { '@meteo': MeteoCondition; };
}

export interface ReductionResponse {
    promocode_name: string;
    status: string;
    avantage?: {
        percent: number;
    };
    reasons?: {};
}

export type OrCondition = Array<{ '@age': AgeCondition; } | { '@date': DateCondition; } | { '@meteo': MeteoCondition; }>;

export type AgeCondition = { lt: number, gt: number; } | { eq: number; };

export type DateCondition = { after?: string, before?: string; };

export type MeteoCondition = { is: string; temp: { lt?: string; gt?: string; }; };
export type MeteoResponse = { weather: [{ description: string; }], main: { temp: number; }; };