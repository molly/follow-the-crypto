export interface ErrorType {
  error: true;
  message?: string;
  statusCode?: number;
}

export function isError(response: any) {
  return typeof response === "object" && "error" in response && response.error;
}

export function is4xx(response: any) {
  return (
    isError(response) &&
    "statusCode" in response &&
    response.statusCode >= 400 &&
    response.statusCode < 500
  );
}
