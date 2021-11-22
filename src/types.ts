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
    restrictions: { '@or': OrConditions; } | { '@age': AgeConditions; } | { '@date': DateConditions; } | { '@meteo': MeteoConditions; };
}

export interface ReductionResponse {
    promocode_name: string;
    status: string;
    avantage?: {
        percent: number;
    };
    reasons?: {};
}

export type OrConditions = Array<{ '@age': AgeConditions; } | { '@date': DateConditions; } | { '@meteo': MeteoConditions; }>;

export type AgeConditions = { lt: number, gt: number; eq: number; };

export type DateConditions = { after?: string, before?: string; };

export type MeteoConditions = { is?: string; temp?: { lt?: string; gt?: string; }; };
export type MeteoResponse = { weather: [{ description: string; }], main: { temp: number; }; };

export interface ValidationStatus {
    valid: boolean,
    error?: string;
    context?: string;
};

export interface PropertyMapping {
    compare: (...args: any[]) => boolean,
    failure: string;
}