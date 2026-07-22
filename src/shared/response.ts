export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  metadata?: any;
}

export const successResponse = (
  data: any,
  message = 'Success',
  metadata = {}
): ApiResponse => {
  return {
    success: true,
    message,
    data,
    metadata,
  };
};

export const errorResponse = (
  message: string,
  code: string
) => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
