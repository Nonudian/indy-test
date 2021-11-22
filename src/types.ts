interface ReductionInput {
    promocode_name: string;
    arguments: {
        age: number;
        meteo: {
            town: string;
        };
    };
}

interface PromoCode {
    _id?: string;
    name: string;
    avantage: {
        percent: number;
    };
    restrictions: { '@or': OrCondition; } | { '@age': AgeCondition; } | { '@date': DateCondition; };
}

interface ReductionResponse {
    promocode_name: string;
    status: string;
    avantage?: {
        percent: number;
    };
    reasons?: {};
}

type OrCondition = Array<{ '@age': AgeCondition; } | { '@date': DateCondition; }>;
type AgeCondition = { lt: number, gt: number; } | { eq: number; };
type DateCondition = { after?: string, before?: string; };