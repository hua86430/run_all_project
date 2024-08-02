export class InvokeResponse {
  success: boolean;
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
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
