export class CustomError extends Error {
  code = 204
  constructor(code: number, message: string) {
    super(message)
    this.code = code
  }
}
