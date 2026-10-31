import { NiceHttpError } from './custom-exceptions.js';

export type Resource<T> =
  | { readonly isSuccess: true; readonly isError: false; readonly data: T }
  | { readonly isSuccess: false; readonly isError: true; readonly error: NiceHttpError };

export const Resource = {
  success<T>(data: T): Resource<T> {
    return { isSuccess: true, isError: false, data };
  },
  error<T = never>(error: NiceHttpError): Resource<T> {
    return { isSuccess: false, isError: true, error };
  },
};
