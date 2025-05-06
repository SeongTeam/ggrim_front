export interface IPaginationResult<T> {
    data: T[];
    count: number;
    pagination: number;
    isMore?: boolean;
}
export interface HttpException {
    message: string | string[];
    error: string;
    statusCode: number;
}

export interface BackendHttpException extends HttpException {
    timeStamp?: Date;
    path?: string;
    errorCode?: number;
}

export interface ServerActionError {
    message: string;
    stack: string;
}
