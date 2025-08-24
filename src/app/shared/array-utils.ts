// shared/array-utils.ts
export class ArrayUtils {
  static shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  static weightedRandomIndex(weights: number[]): number {
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return i;
    }
    return weights.length - 1;
  }
}
