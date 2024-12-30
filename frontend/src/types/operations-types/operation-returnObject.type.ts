import {OperationResponseType} from "./operation-response.type";

export type OperationReturnObjectType = {
    error: string | boolean,
    redirect: string | null,
    operation?: OperationResponseType | null
}