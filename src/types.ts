
// PARAM TYPES
export interface ReductionInput {
    promocode_name: string;
    arguments: {
        age: number;
        meteo: { town: string; };
    };
}

export interface ReductionResponse {
    promocode_name: string;
    status: string;
    avantage?: { percent: number; };
    reasons?: Record<string, string>;
}

export interface PromoCode {
    _id?: string;
    name: string;
    avantage: { percent: number; };
    restrictions: Restrictions;
}


// CRITERION TYPES
type Restrictions = { '@or': OrConditions; } & AndRestrictions;
type AndRestrictions = { '@age': AgeConditions; } | { '@date': DateConditions; } | { '@meteo': MeteoConditions; };

export type OrConditions = Array<AndRestrictions>;

export interface AgeConditions {
    lt: number;
    gt: number;
    eq: number;
};

export interface DateConditions {
    after?: string;
    before?: string;
};

export interface MeteoConditions {
    is?: string;
    temp?: { lt?: string; gt?: string; };
};
export interface MeteoResponse {
    weather: [{ description: string; }];
    main: { temp: number; };
}


// UTIL TYPES
export interface ValidationStatus {
    valid: boolean;
    error?: string;
    context?: string;
};

export interface PropertyMapping {
    compare: (...args: any[]) => boolean,
    failure: string;
}