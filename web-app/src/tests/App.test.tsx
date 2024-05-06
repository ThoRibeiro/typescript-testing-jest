import { render, waitFor, screen } from "@testing-library/react";
import { sendGetRequest, sendPostRequest } from "../lib/http";
import App from "../App";

jest.mock("../lib/http");

describe("App component", () => {
  it("Affiche les articles", async () => {
    const mockArticles = [
      { id: "1", name: "Table", priceEur: 50, weightKg: 4 },
      { id: "2", name: "Chaise", priceEur: 150, weightKg: 20 },
    ];
    const mockOrder = { id: "1" };

    (sendGetRequest as jest.Mock).mockResolvedValue(mockArticles);
    (sendPostRequest as jest.Mock).mockResolvedValue(mockOrder);

    render(<App />);

    await waitFor(() => expect(sendGetRequest).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(sendPostRequest).toHaveBeenCalledTimes(1));

    for (const article of mockArticles) {
      expect(await screen.findByText(article.name)).toBeInTheDocument();
    }
  });
});
