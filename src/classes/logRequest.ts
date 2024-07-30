export class LogRequest {
  level: string;
  path: string;

  constructor(level: string, txt: string) {
    this.level = level;
    this.path = txt;
  }
}
