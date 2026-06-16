export default function FillArray<T>(arr: T[], minimumLength: number, defaultValue: T): T[] {
  if (arr.length >= minimumLength) {
    return arr;
  }

  return [...arr, ...Array(minimumLength - arr.length).fill(defaultValue)].slice(0, minimumLength);
};