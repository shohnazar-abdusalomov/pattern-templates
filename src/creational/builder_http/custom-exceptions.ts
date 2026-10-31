export abstract class NiceHttpError extends Error {
  constructor(
    message: string,
    public readonly code: number = -1,
    public readonly resBody: string = '',
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServerError extends NiceHttpError {
  constructor(code: number, resBody: string, message: string = `Serv: ${code}`) {
    super(message, code, resBody);
  }
}

export class TimeoutError extends NiceHttpError {
  constructor(message: string = 'Timeout', cause?: unknown) {
    super(message, -1, '', cause);
  }
}

export class NetworkError extends NiceHttpError {
  constructor(
    message: string = 'No internet connection. Please check your internet connection and try again.',
    cause?: unknown
  ) {
    super(message, -1, '', cause);
  }
}

export class InvalidUrlError extends NiceHttpError {
  constructor(url: string) {
    super(`Invalid url: ${url}`);
  }
}

export class UnknownError extends NiceHttpError {
  constructor(
    message: string = 'Something went wrong. Please try again.',
    cause?: unknown
  ) {
    super(message, -1, '', cause);
  }
}
