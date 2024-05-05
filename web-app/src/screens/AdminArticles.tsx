// web-app/src/components/AdminArticles.tsx
import React, { useState } from "react";
import { ArticleProps } from "../models/article.model";
import { sendDeleteRequest, sendPutRequest } from "../lib/http";

interface AdminArticlesProps {
  articles: ArticleProps[];
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({ articles }) => {
  const [updatedArticles, setUpdatedArticles] = useState(articles);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    const updatedArticle = { ...updatedArticles[index], [name]: value };
    setUpdatedArticles([
      ...updatedArticles.slice(0, index),
      updatedArticle,
      ...updatedArticles.slice(index + 1),
    ]);
    setEditingIndex(index);
  };

  const handleValidateClick = () => {
    if (editingIndex !== null) {
      const article = updatedArticles[editingIndex];
      const {
        id,
        name: articleName,
        priceEur,
        weightKg,
        specialShippingCost,
      } = article;
      const articleDataToSend = {
        id,
        name: articleName,
        priceEur,
        weightKg,
        specialShippingCost,
      };
      sendPutRequest(
        `http://localhost:3000/articles/${article.id}`,
        articleDataToSend
      );
      setEditingIndex(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    sendDeleteRequest(`http://localhost:3000/articles/${id}`)
      .then(() => {
        setUpdatedArticles(
          updatedArticles.filter((article) => article.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting article:", error);
      });
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Weight</th>
          <th>Shipping </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {updatedArticles.map((article, index) => (
          <tr key={article.id}>
            <td>
              <input
                type="text"
                name="name"
                value={article.name}
                style={{
                  padding: "10px 10px",
                  borderRadius: "4px",
                }}
                onChange={(event) => handleInputChange(event, index)}
              />
            </td>
            <td>
              <input
                type="number"
                name="priceEur"
                value={article.priceEur}
                style={{
                  padding: "10px 10px",
                  borderRadius: "4px",
                }}
                onChange={(event) => handleInputChange(event, index)}
              />
            </td>
            <td>
              <input
                type="number"
                name="weightKg"
                value={article.weightKg}
                style={{
                  padding: "10px 10px",
                  borderRadius: "4px",
                }}
                onChange={(event) => handleInputChange(event, index)}
              />
            </td>
            <td>
              <input
                type="number"
                name="specialShippingCost"
                value={article.specialShippingCost || ""}
                style={{
                  padding: "10px 10px",
                  borderRadius: "4px",
                }}
                onChange={(event) => handleInputChange(event, index)}
              />
            </td>
            <td>
              <button
                onClick={handleValidateClick}
                style={{
                  backgroundColor: "lightgreen",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 10px",
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              >
                Valid
              </button>

              <button
                onClick={() => handleDeleteClick(article.id)}
                style={{
                  backgroundColor: "lightcoral",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 10px",
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
