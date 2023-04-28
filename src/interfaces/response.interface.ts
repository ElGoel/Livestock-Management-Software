//* Basic JSON response for Controllers
export interface BasicResponse {
  message: string;
}

//* Error JSON response for Controllers

export interface ErrorResponse {
  error: string;
  statusText: string;
  message: string;
}
