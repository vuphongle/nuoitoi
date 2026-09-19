export interface ResponseSuccess<T> {
  status: 'success';
  statusCode: number;
  message: string;
  data: T;
}

export interface ResponseError {
  status: 'error';
  statusCode: number;
  message: string;
  stack?: string | null;
}

export const responseSuccess = <T>(
  data: T,
  message: string,
  statusCode = 200,
): ResponseSuccess<T> => {
  return {
    status: 'success',
    statusCode,
    message,
    data,
  };
};

export const responseError = (
  message = 'Internal Server Error',
  statusCode = 500,
  stack: string | null = null,
): ResponseError => {
  return {
    status: 'error',
    statusCode,
    message,
    stack,
  };
};
