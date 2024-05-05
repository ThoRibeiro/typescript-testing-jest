// src/components/ListArticles.tsx
import React from "react";
import { ArticleProps } from "../models/article.model";

interface ListArticlesProps {
  articles: (ArticleProps & { quantity: number })[];
  setArticleQuantity: (id: string, quantity: number) => void;
}

export const ListArticles: React.FC<ListArticlesProps> = ({
  articles,
  setArticleQuantity,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed white",
            borderRadius: "5px",
            padding: "1rem",
          }}
        >
          <span>{article.name}</span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => {
                setArticleQuantity(article.id, article.quantity - 1);
              }}
            >
              -
            </button>
            {article.quantity}
            <button
              onClick={() => {
                setArticleQuantity(article.id, article.quantity + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
