import express from "express";
import { getNewDataSource } from "./config/database";
import { Article } from "./Article";
import orderRoute from "./routes/OrderRoute";
import articleRoute from "./routes/ArticleRoute";

async function main() {
  const app = express();

  // Connexion à la base de données
  const dataSource = await getNewDataSource("./sqlite.db");
  console.log("💾 Successfully connected to database.");

  // Ajoute des routes
  app.use("/orders", orderRoute);
  app.use("/articles", articleRoute);

  await Article.createBaseArticles();
  console.log("Successfully created articles.");

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}.`);
  });
}

main();
