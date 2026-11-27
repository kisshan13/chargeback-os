import type { RequestHandler } from "express";
import { createdSyntheticDisputes, syntheticData } from "../../lib/chargeback-runtime.js";
import ApiResponse from "../../lib/response.js";
import { ApiError } from "../../lib/error.js";
import { requestHandler } from "../../utils/request-handler.js";
import { validatorPaymentsQuery, validatorPaymentsRecordParams } from "./validator.js";

export const controllerListPayments: RequestHandler = requestHandler(async (req) => {
  const { limit, offset } = validatorPaymentsQuery.parse(req.query);
  const collection = syntheticData.payments;
  const items = collection.findMany({ limit, offset }).map((payment) => {
    const customer = syntheticData.customers.findById(payment.customerId);
    const order = syntheticData.orders.findById(payment.orderId);
    const disputeCount = syntheticData.disputes.findMany({ where: { paymentId: payment.id } }).length
      + [...createdSyntheticDisputes.values()].filter((dispute) => dispute.paymentId === payment.id).length;
    return {
      ...payment,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown customer",
      orderReference: order?.externalId ?? payment.orderId,
      refundCount: syntheticData.refunds.findMany({ where: { paymentId: payment.id } }).length,
      disputeCount,
    };
  });
  return new ApiResponse({ name: "payments", items, total: collection.length, limit, offset }, "Payments");
});

export const controllerGetPaymentOverview: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPaymentsRecordParams.parse(req.params);
  const payment = syntheticData.payments.findById(recordId);
  if (!payment) throw new ApiError("Payment not found", 404);
  const order = syntheticData.orders.findById(payment.orderId);
  const transactions = syntheticData.transactions.findMany({ where: { paymentId: payment.id }, orderBy: { field: "occurredAt", direction: "desc" } });
  const transactionIds = new Set(transactions.map((transaction) => transaction.id));
  return new ApiResponse({
    payment,
    customer: syntheticData.customers.findById(payment.customerId) ?? null,
    paymentMethod: syntheticData.paymentMethods.findById(payment.paymentMethodId) ?? null,
    order: order ? {
      ...order,
      items: syntheticData.orderItems.findMany({ where: { orderId: order.id } }).map((item) => ({
        ...item,
        product: syntheticData.products.findById(item.productId) ?? null,
      })),
    } : null,
    transactions,
    authentication: syntheticData.paymentAuthentications.findFirst({ where: { paymentId: payment.id } }) ?? null,
    refunds: syntheticData.refunds.findMany({ where: { paymentId: payment.id } }),
    settlements: syntheticData.settlementEntries.all().filter((entry) => transactionIds.has(entry.transactionId)),
    disputes: [...syntheticData.disputes.findMany({ where: { paymentId: payment.id } }), ...createdSyntheticDisputes.values()].filter((dispute) => dispute.paymentId === payment.id),
  }, "Payment overview");
});

export const controllerGetPaymentsRecord: RequestHandler = requestHandler(async (req) => {
  const { recordId } = validatorPaymentsRecordParams.parse(req.params);
  const record = syntheticData.payments.findById(recordId);
  if (!record) throw new ApiError("Payments record not found", 404);
  return new ApiResponse({ collection: "payments", record }, "Synthetic Payments record");
});
