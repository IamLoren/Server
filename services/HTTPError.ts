type StatusCode = 400 | 401 | 403 | 404 | 409;

const messageList: Record<StatusCode, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};


interface HttpError extends Error {
  status: StatusCode;
}

const HttpError = (status: StatusCode, message: string = messageList[status]): HttpError => {
  const error = new Error(message) as HttpError;
  error.status = status;
  return error;
}

export default HttpError;