export function padLeft(s: string, n: number) {
  if (s.length < n) {
    return new Array(n - s.length + 1).join(" ") + s;
  }
  else {
    return s;
  }
}
