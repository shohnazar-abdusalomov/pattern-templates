export class DatabaseHelper {
  private static instance: DatabaseHelper | null = null;

  private constructor() {
    // Private constructor guarantees singleton instantiation
  }

  public static getInstance(): DatabaseHelper {
    if (!DatabaseHelper.instance) {
      DatabaseHelper.instance = new DatabaseHelper();
    }
    return DatabaseHelper.instance;
  }

  public getData(): void {
    console.log('Get Data');
  }

  public executeQuery(query: string): void {
    console.log(`Query successfully executed: "${query}"`);
  }
}
