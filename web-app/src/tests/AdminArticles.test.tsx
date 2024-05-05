import React from "react";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminArticles } from "../screens/AdminArticles";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const articles = [
  { id: "1234", name: "Chaise", priceEur: 50, weightKg: 4 },
  { id: "5678", name: "Table", priceEur: 150, weightKg: 20 },
];

describe("AdminArticles", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it("affiche les articles", () => {
    const articlesWithQuantity = articles.map((article) => ({
      ...article,
      quantity: 100,
    }));

    render(<AdminArticles articles={articlesWithQuantity} />);

    articlesWithQuantity.forEach((article) => {
      expect(screen.getByDisplayValue(article.name)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(article.priceEur.toString())
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(article.weightKg.toString())
      ).toBeInTheDocument();
    });
  });

  it("met à jour le nom de l'article", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    const articlesWithQuantity = articles.map((article) => ({
      ...article,
      quantity: 100,
    }));
    render(<AdminArticles articles={articlesWithQuantity} />);
    const nameInput = screen.getByDisplayValue(articles[0].name);

    await act(async () => {
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Chapeau");

      const firstRow = screen.getAllByRole("row")[1];
      const validButton = within(firstRow).getByText("Valid");
      await userEvent.click(validButton);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/articles/1234",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...articles[0],
          name: "Chapeau",
        }),
      }
    );

    expect(screen.getByDisplayValue("Chapeau")).toBeInTheDocument();
  });

  it("met à jour le prix de l'article", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    const articlesWithQuantity = articles.map((article) => ({
      ...article,
      quantity: 100,
    }));
    render(<AdminArticles articles={articlesWithQuantity} />);
    const priceInput = screen.getByDisplayValue(
      articles[0].priceEur.toString()
    );

    await act(async () => {
      await userEvent.clear(priceInput);
      await userEvent.type(priceInput, "60");

      const firstRow = screen.getAllByRole("row")[1];
      const validButton = within(firstRow).getByText("Valid");
      await userEvent.click(validButton);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/articles/1234",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...articles[0],
          priceEur: Number("60"),
        }),
      }
    );
    expect(screen.getByDisplayValue("60")).toBeInTheDocument();
  });
  it("supprimer un article", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    const articlesWithQuantity = articles.map((article) => ({
      ...article,
      quantity: 100,
    }));
    render(<AdminArticles articles={articlesWithQuantity} />);

    await act(async () => {
      const firstRow = screen.getAllByRole("row")[1];
      const deleteButton = within(firstRow).getByText("Delete");
      await userEvent.click(deleteButton);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/articles/1234",
      {
        method: "DELETE",
      }
    );
    expect(
      screen.queryByDisplayValue(articles[0].name)
    ).not.toBeInTheDocument();
  });
});
