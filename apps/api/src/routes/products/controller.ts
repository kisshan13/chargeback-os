import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorProductsQuery, validatorProductsRecordParams } from "./validator.js";

export const controllerListProducts: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorProductsQuery.parse(req.query);
  const collection = syntheticData.products;
  const items = collection.findMany({ limit, offset }).map((product) => {
    const prices = syntheticData.productPrices.findMany({ where: { productId: product.id } });
    const soldItems = syntheticData.orderItems.findMany({ where: { productId: product.id } });
    return {
      ...product,
      currentPrice: prices.find((price) => price.effectiveUntil === null) ?? prices[0] ?? null,
      orderCount: new Set(soldItems.map((item) => item.orderId)).size,
      unitsSold: soldItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  });
  return new ApiResponse({ name: "products", items, total: collection.length, limit, offset }, "Products");
});

export const controllerGetProductOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorProductsRecordParams.parse(req.params);
  const product = syntheticData.products.findById(recordId);
  if (!product) throw new ApiError("Product not found", 404);
  const prices = syntheticData.productPrices.findMany({ where: { productId: product.id }, orderBy: { field: "effectiveFrom", direction: "desc" } });
  const items = syntheticData.orderItems.findMany({ where: { productId: product.id } });
  const orderIds = [...new Set(items.map((item) => item.orderId))];
  const orders = orderIds.map((orderId) => {
    const order = syntheticData.orders.findById(orderId);
    return order ? {
      ...order,
      customer: syntheticData.customers.findById(order.customerId) ?? null,
      item: items.find((item) => item.orderId === orderId) ?? null,
    } : null;
  }).filter((order) => order !== null).sort((left, right) => right.placedAt.localeCompare(left.placedAt));
  return new ApiResponse({ product, prices, orders }, "Product overview");
});

export const controllerGetProductsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorProductsRecordParams.parse(req.params);
  const record = syntheticData.products.findById(recordId);
  if (!record) throw new ApiError("Products record not found", 404);
  return new ApiResponse({ collection: "products", record }, "Synthetic Products record");
});
