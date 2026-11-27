import type { RequestHandler } from "express";
import { syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorOrdersQuery, validatorOrdersRecordParams } from "./validator.js";

export const controllerListOrders: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorOrdersQuery.parse(req.query);
  const collection = syntheticData.orders;
  const items = collection.findMany({ limit, offset }).map((order) => {
    const shipments = syntheticData.shipments.findMany({ where: { orderId: order.id } });
    const fulfillmentStatus = shipments.some((shipment) => shipment.status === "DELIVERED")
      ? "Delivered"
      : shipments.some((shipment) => shipment.status === "IN_TRANSIT" || shipment.status === "SHIPPED")
        ? "In transit"
        : shipments[0]?.status?.toLowerCase().replaceAll("_", " ") ?? "Not shipped";
    const customer = syntheticData.customers.findById(order.customerId);
    return {
      ...order,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown customer",
      itemCount: syntheticData.orderItems.findMany({ where: { orderId: order.id } }).length,
      fulfillmentStatus,
    };
  });
  return new ApiResponse({ name: "orders", items, total: collection.length, limit, offset }, "Orders");
});

export const controllerGetOrderOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorOrdersRecordParams.parse(req.params);
  const order = syntheticData.orders.findById(recordId);
  if (!order) throw new ApiError("Order not found", 404);

  const shipments = syntheticData.shipments.findMany({ where: { orderId: order.id } });
  const items = syntheticData.orderItems.findMany({ where: { orderId: order.id } }).map((item) => ({
    ...item,
    product: syntheticData.products.findById(item.productId) ?? null,
  }));
  return new ApiResponse({
    order,
    customer: syntheticData.customers.findById(order.customerId) ?? null,
    merchant: syntheticData.merchants.findById(order.merchantId) ?? null,
    billingAddress: syntheticData.addresses.findById(order.billingAddressId) ?? null,
    shippingAddress: order.shippingAddressId ? syntheticData.addresses.findById(order.shippingAddressId) ?? null : null,
    items,
    payments: syntheticData.payments.findMany({ where: { orderId: order.id } }),
    shipments: shipments.map((shipment) => ({
      ...shipment,
      destination: syntheticData.addresses.findById(shipment.destinationAddressId) ?? null,
      events: syntheticData.shipmentEvents.findMany({
        where: { shipmentId: shipment.id },
        orderBy: { field: "occurredAt", direction: "desc" },
      }),
      deliveryConfirmations: syntheticData.deliveryConfirmations.findMany({ where: { shipmentId: shipment.id } }),
    })),
  }, "Order overview");
});

export const controllerGetOrdersRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorOrdersRecordParams.parse(req.params);
  const record = syntheticData.orders.findById(recordId);
  if (!record) throw new ApiError("Orders record not found", 404);
  return new ApiResponse({ collection: "orders", record }, "Synthetic Orders record");
});
