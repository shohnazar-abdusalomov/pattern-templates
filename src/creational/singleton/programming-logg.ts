export class ProgrammingLogg {
  private static instance: ProgrammingLogg | null = null;

  private constructor() {
    // Private constructor guarantees singleton instantiation
  }

  public static getInstance(): ProgrammingLogg {
    if (!ProgrammingLogg.instance) {
      ProgrammingLogg.instance = new ProgrammingLogg();
    }
    return ProgrammingLogg.instance;
  }

  public log(message: string): void {
    console.log(message);
  }

  public showError(message: string): void {
    console.log(`ERR:${message}`);
  }
}
