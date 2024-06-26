import {
  BaseEntity,
  Column,
  Entity,
  FindOneOptions,
  getConnection,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { sendEmail } from "./lib/email";
import { Article } from "./Article";
import { ArticleInOrder } from "./ArticleInOrder";

const LIMIT_BEFORE_OFFERING_SHIPPING_COSTS = 10000;
const TAX_PER_GRAM = 1

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.order, {
    eager: true,
  })
  articlesInOrder!: ArticleInOrder[];

  @Column({ default: false })
  submitted!: boolean;

  @Column({ type: "integer", nullable: true })
  totalWithoutShipping?: number;

  @Column({ type: "integer", nullable: true })
  shipping?: number;

  @Column({ type: "integer", nullable: true })
  totalWithShipping?: number;

  @Column({ default: "Not Submitted" })
  status!: string;

  static async createOrder(
    articlesInOrder: { articleId: string; quantity: number }[]
  ): Promise<Order> {
    for (const { articleId } of articlesInOrder) {
      const article = await Article.findOne({ where: { id: articleId } });
      if (!article) {
        throw new Error(`Article with ID ${articleId} not found.`);
      }
    }

    const order = Order.create({
      totalWithoutShipping: 0,
      shipping: 0,
      totalWithShipping: 0,
    });
    await order.save();

    for (const { articleId, quantity } of articlesInOrder) {
      const article = await Article.findOneOrFail({ where: { id: articleId } });
      const articleInOrder = ArticleInOrder.create();
      articleInOrder.order = order;
      articleInOrder.article = article;
      articleInOrder.quantity = quantity;
      await articleInOrder.save();
    }

    await order.reload();
    return order;
  }

  static async createOrderVoid(): Promise<Order> {
    const order = Order.create({
      totalWithoutShipping: 0,
      shipping: 0,
      totalWithShipping: 0,
    });
    await order.save();

    return order;
  }

  async submitOrder() {
    this.submitted = true;
    await this.save();
    sendEmail();
  }

  private getTotalPrice(): number {
    return this.articlesInOrder.reduce(
      (total, { article, quantity }) => total + article.priceEurCent * quantity,
      0
    );
  }

  getShippingCost(): number {
    return this.getTotalPrice() >= LIMIT_BEFORE_OFFERING_SHIPPING_COSTS
      ? 0
      : this.articlesInOrder.reduce(
          (total, { article, quantity }) =>
            total +
            (article.specialShippingCostEurCent || article.weightG * TAX_PER_GRAM) * quantity,
          0
        );
  }

  getOrderCost(): {
    totalWithoutShipping: number;
    shipping: number;
    totalWithShipping: number;
  } {
    const totalWithoutShipping = this.getTotalPrice();
    const shipping = this.getShippingCost();

    return {
      totalWithoutShipping,
      shipping,
      totalWithShipping: totalWithoutShipping + shipping,
    };
  }

  static async getOrderDetails(id: string): Promise<any> {
    try {
      const options: FindOneOptions<Order> = {
        where: { id },
        relations: ["articlesInOrder"],
      };

      const order = await Order.findOneOrFail(options);

      await order.reload();

      const totalWithoutShipping = order.getTotalPrice();
      const shipping = order.getShippingCost();
      const totalWithShipping = totalWithoutShipping + shipping;

      return {
        articles: order.articlesInOrder.map((item) => ({
          name: item.article.name,
          unitPrice: item.article.priceEurCent,
          quantity: item.quantity,
        })),
        totalWithoutShipping,
        shipping,
        totalWithShipping,
        status: order.submitted ? "Submitted" : "Not Submitted",
      };
    } catch (error) {
      throw new Error(`Error fetching order details: ${error}`);
    }
  }

  static async getOrderStats(): Promise<
    { month: string; totalPrice: number }[]
  > {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const monthlyStats: { month: string; totalPrice: number }[] = [];

    for (let i = 0; i < 6; i++) {
      const month = currentMonth - i;
      const year = currentYear - Math.floor((currentMonth - month - 1) / 12);
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

      const result = await this.createQueryBuilder("order")
        .select("SUM(order.totalWithShipping)", "totalPrice")
        .where("order.createdAt BETWEEN :firstDayOfMonth AND :lastDayOfMonth", {
          firstDayOfMonth: firstDayOfMonth.toISOString(),
          lastDayOfMonth: lastDayOfMonth.toISOString(),
        })
        .getRawOne();

      monthlyStats.push({
        month: `${year}-${month < 10 ? "0" + month : month}`,
        totalPrice: result.totalPrice || 0,
      });
    }

    return monthlyStats;
  }

  static async updateOrder(
    orderId: string,
    updates: Partial<Order>,
    articlesInOrder: { articleId: string; quantity: number }[] = []
  ): Promise<Order> {
    try {
      const order = await Order.findOne({
        where: { id: orderId },
        relations: ["articlesInOrder"],
      });

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }

      await ArticleInOrder.delete({ order: order });

      for (const { articleId, quantity } of articlesInOrder) {
        const article = await Article.findOneOrFail({
          where: { id: articleId },
        });
        const articleInOrder = ArticleInOrder.create();
        articleInOrder.order = order;
        articleInOrder.article = article;
        articleInOrder.quantity = quantity;
        await articleInOrder.save();
      }
      Object.assign(order, updates);
      await order.save();

      return order;
    } catch (error) {
      throw new Error(`Error updating order: ${error}`);
    }
  }

  async deleteOrder() {
    await Order.delete({ id: this.id });
  }
}
