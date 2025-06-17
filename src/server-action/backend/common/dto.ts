import { HttpStatusValueType, ServiceExceptionValueType } from './status';

export interface IPaginationResult<T> {
    data: T[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
}
export interface HttpException {
    message: string | string[];
    error?: string;
    statusCode: HttpStatusValueType;
}

export interface BackendHttpException extends HttpException {
    timeStamp?: Date;
    path?: string;
    errorCode?: ServiceExceptionValueType;
}

export interface ServerActionError {
    message: string;
    stack: string;
}
