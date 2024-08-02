export class InvokeResponse<T> {
  success: boolean;
  message: string;
  data: any;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message: string) {
    return new InvokeResponse(true, message);
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
