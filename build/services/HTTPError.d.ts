type StatusCode = 400 | 401 | 403 | 404 | 409;
interface HttpError extends Error {
    status: StatusCode;
}
declare const HttpError: (status: StatusCode, message?: string) => HttpError;
export default HttpError;
