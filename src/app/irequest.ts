export interface iRequest {
    NewDataSet: iWeb_Requests;
}

export interface iWeb_Requests {
    i_WebTMA_Requests: iWeb_Request[];
}

export class iWeb_Request {
    ILOG_NUMBER: string;
    ILOG_PROCESSED: string;
    ILOG_PROCESSED_ERROR: string;
}
