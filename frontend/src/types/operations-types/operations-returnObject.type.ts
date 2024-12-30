import {OperationResponseType} from "./operation-response.type";

export type OperationsReturnObjectType = {
    error: string | boolean,
    redirect: string | null,
    operations?: OperationResponseType[] | null
}