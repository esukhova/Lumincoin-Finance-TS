import {OperationsTypesType} from "./operations-types.type";

export type OperationType = {
    type: string,
    amount: number,
    date: string,
    comment: string,
    category_id: number
}