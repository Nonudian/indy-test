


interface ReductionInput {
    promocode_name: string;
    arguments: {
        age: number;
        meteo: {
            town: string;
        };
    };
}

interface ReductionResponse {
    promocode_name: string;
    status: string;
    avantage?: {
        percent: number;
    };
    reasons?: {
        meteo: string;
    };
}

interface PromoCode {
    _id?: string;
    name: string;
    avantage: {
        percent: number;
    };
    restrictions: {
        '@or'?: [],
        '@date'?: {},
        '@meteo'?: {};
    };
}

export async function askReduction(askReductionInput: ReductionInput, promoCode: PromoCode): Promise<ReductionResponse> {



}
