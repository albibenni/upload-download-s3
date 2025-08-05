export class ExampleService {
  async getMessage(): Promise<{ message: string }> {
    const response = await fetch("/api/v1");
    return response.json();
  }
}
