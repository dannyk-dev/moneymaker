export default class GenericError extends Error {
  statusCode: number;

  constructor(
    message: string = "Unknown Server error",
    statusCode: number = 500
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
