import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateManyOrderItemInputObjectSchema as OrderItemCreateManyOrderItemInputObjectSchema } from './OrderItemCreateManyOrderItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderItemCreateManyOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateManyOrderItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderItemCreateManyOrderItemInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderItemCreateManyOrderItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyOrderItemInputEnvelope>;
export const OrderItemCreateManyOrderItemInputEnvelopeObjectZodSchema = makeSchema();
