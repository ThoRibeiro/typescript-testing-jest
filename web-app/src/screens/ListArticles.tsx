import React, { useEffect, useState } from "react";
import { ArticleProps } from "../models/article.model";
import { sendPostRequest, sendPutRequest, sendGetRequest } from "../lib/http";

interface ListArticlesProps {
  articles: (ArticleProps & { quantity: number })[];
  setArticleQuantity: (id: string, quantity: number) => void;
  orderId: string;
}

export const ListArticles: React.FC<ListArticlesProps> = ({
  articles,
  setArticleQuantity,
  orderId,
}) => {
  const handleQuantityChange = (id: string, quantity: number) => {
    setArticleQuantity(id, quantity);

    if (orderId) {
      sendPutRequest(`http://localhost:3000/orders/${orderId}`, {
        articleId: id,
        quantity,
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
  };
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
          role="listitem"
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
                handleQuantityChange(article.id, article.quantity - 1);
              }}
            >
              -
            </button>
            {article.quantity}
            <button
              onClick={() => {
                handleQuantityChange(article.id, article.quantity + 1);
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
