import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { sendGetRequest, sendPostRequest } from "./lib/http";
import { ArticleProps } from "./models/article.model";
import { ListArticles } from "./screens/ListArticles";
import { AdminArticles } from "./screens/AdminArticles";
import NavigationBar from "./components/navigation";
import { Order } from "./components/order";

function App() {
  const [articles, setArticles] = useState<
    (ArticleProps & { quantity: number })[] | null
  >(null);
  const [orderId, setOrderId] = useState<string | null>(null);

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

  const createOrder = async () => {
    const response = await sendPostRequest(`http://localhost:3000/orders/`, {});
    setOrderId(response.id as string);
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
    createOrder();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <NavigationBar>
            <Routes>
              <Route
                path="/admin/articles"
                element={
                  articles ? (
                    <AdminArticles articles={articles} />
                  ) : (
                    "Chargement…"
                  )
                }
              />

              <Route
                path="/"
                element={
                  articles && orderId ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ marginRight: "2rem" }}>
                        <ListArticles
                          articles={articles}
                          setArticleQuantity={setArticleQuantity}
                          orderId={orderId}
                        />
                      </div>
                      <Order orderId={orderId} articles={articles} />
                    </div>
                  ) : (
                    "Loading Products"
                  )
                }
              />
            </Routes>
          </NavigationBar>
        </header>
      </div>
    </Router>
  );
}
export default App;
