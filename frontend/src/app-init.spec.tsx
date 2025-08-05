import { render } from "@testing-library/react";
import App from "./app-init.tsx";

describe("App", () => {
  it("should render", () => {
    render(<App />);
  });
});
