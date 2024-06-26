import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListArticles } from "../screens/ListArticles";

const articles = [
  { id: "1234", name: "Chaise", priceEurCent: 5000, quantity: 0, weightG: 4000 },
  { id: "5678", name: "Table", priceEurCent: 15000, quantity: 0, weightG: 20000 },
];

const mockSetArticleQuantity = jest.fn();

describe("ListArticles", () => {
  it("affiches les articles", async () => {
    render(
      <ListArticles
        articles={articles}
        setArticleQuantity={mockSetArticleQuantity}
        orderId={""}
      />
    );

    let articleElements: HTMLElement[];
    await waitFor(() => {
      articleElements = screen.getAllByRole("listitem");
      expect(articleElements).toHaveLength(2);
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("Chaise");
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("0");
    });

    await waitFor(() => {
      const buttons = within(articleElements[0]).getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("-");
    });

    await waitFor(() => {
      expect(articleElements[0].textContent).toMatch("+");
    });
  });

  describe("button + click", () => {
    it("increments count", async () => {
      render(
        <ListArticles
          articles={articles}
          setArticleQuantity={mockSetArticleQuantity}
          orderId={""}
        />
      );

      let articleElements: HTMLElement[];
      await waitFor(() => {
        articleElements = screen.getAllByRole("listitem");
        const buttonPlus = within(articleElements[0]).getByText("+");

        buttonPlus.click();
        expect(mockSetArticleQuantity).toHaveBeenCalledWith("1234", 1);
      });

      await waitFor(() => {
        expect(articleElements[1].textContent).toMatch("0");
      });
    });
  });
});
