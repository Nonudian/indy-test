import { OrConditions, ValidationStatus } from '../types';


export async function orChecking(
    conditions: OrConditions,
    conditionMapping: Record<string, (...args: any) => Promise<ValidationStatus>>
): Promise<boolean> {

    for (let condition of conditions) {
        const conditionName = Object.keys(condition)[0];
        if (await conditionMapping[conditionName](condition[conditionName])) return true;
    }

    return false;
}