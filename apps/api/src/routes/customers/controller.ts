import type { RequestHandler } from "express";
import { createdSyntheticDisputes, syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorCustomersQuery, validatorCustomersRecordParams } from "./validator.js";

export const controllerListCustomers: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorCustomersQuery.parse(req.query);
  const collection = syntheticData.customers;
  const items = collection.findMany({ limit, offset }).map((customer) => {
    const orders = syntheticData.orders.findMany({ where: { customerId: customer.id } });
    const payments = syntheticData.payments.findMany({ where: { customerId: customer.id } });
    return {
      ...customer,
      fullName: `${customer.firstName} ${customer.lastName}`,
      orderCount: orders.length,
      lifetimeValueMinor: payments.reduce((total, payment) => total + payment.amountMinor, 0),
    };
  });
  return new ApiResponse({ name: "customers", items, total: collection.length, limit, offset }, "Customers");
});

export const controllerGetCustomerOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorCustomersRecordParams.parse(req.params);
  const customer = syntheticData.customers.findById(recordId);
  if (!customer) throw new ApiError("Customer not found", 404);

  const orders = syntheticData.orders.findMany({
    where: { customerId: customer.id },
    orderBy: { field: "placedAt", direction: "desc" },
  });
  const payments = syntheticData.payments.findMany({ where: { customerId: customer.id } });
  const paymentIds = new Set(payments.map((payment) => payment.id));
  const disputes = [...syntheticData.disputes.all(), ...createdSyntheticDisputes.values()]
    .filter((dispute) => paymentIds.has(dispute.paymentId));

  return new ApiResponse({
    customer,
    merchant: syntheticData.merchants.findById(customer.merchantId) ?? null,
    addresses: syntheticData.addresses.findMany({ where: { customerId: customer.id } }),
    paymentMethods: syntheticData.paymentMethods.findMany({ where: { customerId: customer.id } }),
    payments,
    disputes,
    orders: orders.map((order) => ({
      ...order,
      items: syntheticData.orderItems.findMany({ where: { orderId: order.id } }).map((item) => ({
        ...item,
        product: syntheticData.products.findById(item.productId) ?? null,
      })),
      payments: payments.filter((payment) => payment.orderId === order.id),
    })),
  }, "Customer overview");
});

export const controllerGetCustomersRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorCustomersRecordParams.parse(req.params);
  const record = syntheticData.customers.findById(recordId);
  if (!record) throw new ApiError("Customers record not found", 404);
  return new ApiResponse({ collection: "customers", record }, "Synthetic Customers record");
});
