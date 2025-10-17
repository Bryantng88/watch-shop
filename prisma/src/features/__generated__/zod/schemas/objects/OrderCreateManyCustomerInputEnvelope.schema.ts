import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateManyCustomerInputObjectSchema as OrderCreateManyCustomerInputObjectSchema } from './OrderCreateManyCustomerInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderCreateManyCustomerInputObjectSchema), z.lazy(() => OrderCreateManyCustomerInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderCreateManyCustomerInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderCreateManyCustomerInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateManyCustomerInputEnvelope>;
export const OrderCreateManyCustomerInputEnvelopeObjectZodSchema = makeSchema();
