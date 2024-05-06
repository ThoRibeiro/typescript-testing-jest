import { render, waitFor, screen } from "@testing-library/react";
import { sendGetRequest } from "../lib/http";
import { Order } from "../components/order";

jest.mock("../lib/http");

describe("Order component", () => {
  it("Affiche les orders", async () => {
    const mockOrder = {
      id: "1",
      articles: [
        { articleId: "Table", quantity: 2 },
        { articleId: "Chaise", quantity: 3 },
      ],
    };

    (sendGetRequest as jest.Mock).mockResolvedValue(mockOrder);

    render(<Order orderId="1" articles={[]} />);

    await waitFor(() => expect(sendGetRequest).toHaveBeenCalledTimes(1));

    expect(await screen.findByText("Order")).toBeInTheDocument();
    expect(await screen.findByText("Article ID: Table")).toBeInTheDocument();
    expect(await screen.findByText("Quantity: 2")).toBeInTheDocument();
    expect(await screen.findByText("Article ID: Chaise")).toBeInTheDocument();
    expect(await screen.findByText("Quantity: 3")).toBeInTheDocument();
  });
});
