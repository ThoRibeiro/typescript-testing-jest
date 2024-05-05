// App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { sendGetRequest } from "./lib/http";
import { ArticleProps } from "./models/article.model";
import { ListArticles } from "./screens/ListArticles";
import { AdminArticles } from "./screens/AdminArticles";

function App() {
  const [articles, setArticles] = useState<
    (ArticleProps & { quantity: number })[] | null
  >(null);

  const fetchArticles = async () => {
    const fetchedArticles = await sendGetRequest(
      "http://localhost:3000/articles"
    );

    if (fetchedArticles) {
      setArticles(
        (fetchedArticles as unknown as ArticleProps[]).map((article) => ({
          ...article,
          quantity: 0,
        }))
      );
    } else {
      console.error("No articles found in the response");
    }
  };

  const setArticleQuantity = (id: string, quantity: number) => {
    if (articles) {
      setArticles(
        articles?.map((article) =>
          article.id === id ? { ...article, quantity } : article
        )
      );
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route
              path="/admin/articles"
              element={
                articles ? <AdminArticles articles={articles} /> : "Chargement…"
              }
            />

            <Route
              path="/"
              element={
                articles ? (
                  <ListArticles
                    articles={articles}
                    setArticleQuantity={setArticleQuantity}
                  />
                ) : (
                  "Chargement…"
                )
              }
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
