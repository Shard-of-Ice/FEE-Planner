export class Base64 {
  static convertionTable =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';

  static fromTinyInt(i: number): string {
    return this.convertionTable[i];
  }

  static toTinyInt(char: string): number {
    return this.convertionTable.indexOf(char);
  }

  static fromTinyIntArray(array: number[]): string {
    return Array.from(array, (i) => this.fromTinyInt(i)).join();
  }

  static toTinyIntArray(b64: string): number[] {
    return Array.from(b64, (char) => this.toTinyInt(char));
  }
}
