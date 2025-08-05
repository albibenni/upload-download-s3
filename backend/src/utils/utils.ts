export function handleErrorLog(e: unknown): void {
  if (typeof e === "string") {
    console.log(e.toUpperCase()); // works, `e` narrowed to string
  } else if (e instanceof Error) {
    console.log(e.message); // works, `e` narrowed to Error
  }
}
