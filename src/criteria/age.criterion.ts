import { AgeConditions, PropertyMapping, ValidationStatus } from '../types';


// CONDITION MAPPING
const ageMapping: Record<string, PropertyMapping> = {
    eq: {
        compare: (current: number, condition: number) => current === condition,
        failure: 'isNotEq'
    },
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
export async function ageChecking(conditions: AgeConditions, age: number): Promise<ValidationStatus> {

    for (const condition in conditions) {
        if (!ageMapping[condition].compare(age, conditions[condition]))
            return { valid: false, error: ageMapping[condition].failure, context: 'age' };
    }

    return { valid: true };
}