import moment from 'moment';
import { DateConditions, PropertyMapping, ValidationStatus } from '../types';


// CONDITION MAPPING
const dateMapping: Record<string, PropertyMapping> = {
    after: {
        compare: (condition: number) => moment().isAfter(moment(condition)),
        failure: 'isNotAfter'
    },
    before: {
        compare: (condition: number) => moment().isBefore(moment(condition)),
        failure: 'isNotBefore'
    }
};

// CHECKING FUNCTION
export async function dateChecking(conditions: DateConditions): Promise<ValidationStatus> {

    for (const condition in conditions) {
        if (!dateMapping[condition].compare(conditions[condition]))
            return { valid: false, error: dateMapping[condition].failure, context: 'date' };
    }

    return { valid: true };
}