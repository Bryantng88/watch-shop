import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateManyLinkedOrderItemInputObjectSchema as OrderItemCreateManyLinkedOrderItemInputObjectSchema } from './OrderItemCreateManyLinkedOrderItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderItemCreateManyLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateManyLinkedOrderItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderItemCreateManyLinkedOrderItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyLinkedOrderItemInputEnvelope>;
export const OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectZodSchema = makeSchema();
