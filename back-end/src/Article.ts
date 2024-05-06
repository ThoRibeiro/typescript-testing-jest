import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticleInOrder } from "./ArticleInOrder";

const BASE_ARTICLES = [
  {
    name: "Câble HDMI",
    priceEurCent: 2000,
    weightKg: 0.1,
  },
  {
    name: "Cuisse de poulet",
    priceEurCent: 1000,
    weightKg: 0.15,
    specialShippingCostEurCent: 400,
  },
  {
    name: "Chaise",
    priceEurCent: 5000,
    weightKg: 5,
  },
];

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "real" })
  priceEurCent!: number;

  @Column({ type: "real" })
  weightKg!: number;

  @Column({ type: "integer", nullable: true })
  specialShippingCostEurCent!: number | null;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.article)
  ordersWithArticle!: ArticleInOrder[];

  static async createBaseArticles() {
    for (const baseArticle of BASE_ARTICLES) {
      const existingArticle = await this.findOne({
        where: { name: baseArticle.name },
      });
      if (!existingArticle) {
        const article = new Article();
        article.name = baseArticle.name;
        article.priceEurCent = baseArticle.priceEurCent;
        article.weightKg = baseArticle.weightKg;
        article.specialShippingCostEurCent = baseArticle.specialShippingCostEurCent ?? null;
        await article.save();
      }
    }
  }

  static async createArticle(articleData: {
    name: string;
    priceEurCent: number;
    weightKg: number;
    specialShippingCostEurCent?: number;
  }) {
    const existingArticle = await this.findOne({
      where: { name: articleData.name },
    });
    if (existingArticle) {
      throw new Error("An article with this name already exists.");
    }
    const article = new Article();
    article.name = articleData.name;
    article.priceEurCent = articleData.priceEurCent;
    article.weightKg = articleData.weightKg;
    article.specialShippingCostEurCent = articleData.specialShippingCostEurCent ?? null;
    await article.save();
    return article;
  }

  static async getArticles() {
    return await this.find();
  }

  static async deleteArticle(id: string) {
    await this.delete(id);
  }

  static async updateArticle(
    id: string,
    articleData: Partial<{
      name: string;
      priceEurCent: number;
      weightKg: number;
      specialShippingCostEurCent?: number;
    }>
  ) {
    await this.update(id, articleData);
  }
}
