export interface BasicResponse {
  status: 'success' | 'error';
  message: string;
}

export interface ApiResponse<T = undefined> extends BasicResponse {
  data?: T;
}
