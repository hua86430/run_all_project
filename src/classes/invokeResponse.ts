export class InvokeResponse<T = any> {
  success: boolean;
  message: string;
  data: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message: string) {
    return new InvokeResponse(true, message);
  }

  static successWithData<T>(message: string, data: T) {
    return new InvokeResponse(true, message, data);
  }

  static error(message: string) {
    return new InvokeResponse(false, message);
  }

  ensureSuccess() {
    if (!this.success) {
      throw new Error(this.message);
    }
  }
}
