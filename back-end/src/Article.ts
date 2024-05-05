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
    name: "RASP PI 5 B 8GB",
    priceEurCent: 8753,
    weightG: 64,
  },
  {
    name: "ASR 90GA3YZZ",
    priceEurCent: 100739,
    weightG: 2129,
    specialShippingCostEurCent: 50,
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
  weightG!: number;

  @Column({ type: "integer", nullable: true })
  specialShippingCostEurCent!: number | null;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.article)
  ordersWithArticle!: ArticleInOrder[];

  static async createBaseArticles() {
    for (const baseArticle of BASE_ARTICLES) {
      const article = new Article();
      article.name = baseArticle.name;
      article.priceEurCent = baseArticle.priceEurCent;
      article.weightG = baseArticle.weightG;
      article.specialShippingCostEurCent = baseArticle.specialShippingCostEurCent ?? null;

      // TODO: do not insert if article with name already exists
      await article.save();
    }
  }
}
