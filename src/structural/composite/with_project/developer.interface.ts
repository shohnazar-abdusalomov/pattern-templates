export interface Developer {
  readonly role: string;
  develop(): void;
  test(): void;
}
