import express, { Request, Response } from "express";
import { Article } from "../Article";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const newArticle = await Article.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const articles = await Article.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findOne(articleId);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    await Article.deleteArticle(articleId);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const updates = req.body;
    await Article.updateArticle(articleId, updates);
    const updatedArticle = await Article.findOne(articleId);
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
});

export default router;
