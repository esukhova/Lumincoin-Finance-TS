import {OperationsTypesType} from "./operations-types.type";

export type OperationResponseType = {
    id: number,
    type: OperationsTypesType,
    amount: number,
    date: string,
    comment: string,
    category: string
}
