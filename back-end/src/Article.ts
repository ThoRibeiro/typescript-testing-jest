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
    priceEurCent: 20,
    weightKg: 0.1,
  },
  {
    name: "Cuisse de poulet",
    priceEurCent: 10,
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
  priceEurCent!: number;

  @Column({ type: "real" })
  weightKg!: number;

  @Column({ type: "integer", nullable: true })
  specialShippingCost!: number | null;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.article)
  ordersWithArticle!: ArticleInOrder[];

  static async createBaseArticles() {
    for (const baseArticle of BASE_ARTICLES) {
      const article = new Article();
      article.name = baseArticle.name;
      article.priceEurCent = baseArticle.priceEurCent;
      article.weightKg = baseArticle.weightKg;
      article.specialShippingCost = baseArticle.specialShippingCost ?? null;

      // TODO: do not insert if article with name already exists
      await article.save();
    }
  }
}
