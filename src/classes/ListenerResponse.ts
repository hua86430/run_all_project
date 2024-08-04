export class ListenerResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message: string) {
    return new ListenerResponse(true, message);
  }

  static successWithData<T>(message: string, data: T) {
    return new ListenerResponse(true, message, data);
  }

  static error(message: string) {
    return new ListenerResponse(false, message);
  }

  static errorWithData<T>(message: string, data: T) {
    return new ListenerResponse(false, message, data);
  }

  ensureSuccess() {
    if (!this.success) {
      throw new Error(this.message);
    }
  }
}
