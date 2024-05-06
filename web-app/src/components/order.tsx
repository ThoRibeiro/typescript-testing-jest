import React, { useEffect, useState } from "react";
import { sendGetRequest } from "../lib/http";
import { ArticleProps } from "../models/article.model";

interface OrderPageProps {
  orderId: string;
  articles: (ArticleProps & { quantity: number })[];
}
interface OrderArticle {
  articleId: string;
  quantity: number;
}

interface Order {
  id: string;
  articles: OrderArticle[];
}

export const Order: React.FC<OrderPageProps> = ({ orderId, articles }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    sendGetRequest(`http://localhost:3000/orders/${orderId}`)
      .then((response) => {
        console.log(response);
        setOrder(response as unknown as Order);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [orderId, articles]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        border: "1px dashed white",
        borderRadius: "4px",
        padding: "4rem",
      }}
    >
      <h2>Order</h2>
      {order.articles.map((article, index) => (
        <div
          key={article.articleId}
          style={{
            borderTop: index !== 0 ? "1px solid white" : "none",
            padding: "1rem",
          }}
        >
          <span>Article ID: {article.articleId}</span>
          <span style={{ marginLeft: "1rem" }}>
            Quantity: {article.quantity}
          </span>
        </div>
      ))}
    </div>
  );
};
