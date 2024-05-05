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
    priceEur: 20,
    weightKg: 0.1,
  },
  {
    name: "Cuisse de poulet",
    priceEur: 10,
    weightKg: 0.15,
    specialShippingCost: 4,
  },
];

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "real" })
  priceEur!: number;

  @Column({ type: "real" })
  weightKg!: number;

  @Column({ type: "integer", nullable: true })
  specialShippingCost!: number | null;

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
        article.priceEur = baseArticle.priceEur;
        article.weightKg = baseArticle.weightKg;
        article.specialShippingCost = baseArticle.specialShippingCost ?? null;
        await article.save();
      }
    }
  }

  static async createArticle(articleData: {
    name: string;
    priceEur: number;
    weightKg: number;
    specialShippingCost?: number;
  }) {
    const existingArticle = await this.findOne({
      where: { name: articleData.name },
    });
    if (existingArticle) {
      throw new Error("An article with this name already exists.");
    }
    const article = new Article();
    article.name = articleData.name;
    article.priceEur = articleData.priceEur;
    article.weightKg = articleData.weightKg;
    article.specialShippingCost = articleData.specialShippingCost ?? null;
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
      priceEur: number;
      weightKg: number;
      specialShippingCost?: number;
    }>
  ) {
    await this.update(id, articleData);
  }
}
