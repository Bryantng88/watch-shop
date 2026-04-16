import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateManyServiceCatalogInputObjectSchema as OrderItemCreateManyServiceCatalogInputObjectSchema } from './OrderItemCreateManyServiceCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderItemCreateManyServiceCatalogInputObjectSchema), z.lazy(() => OrderItemCreateManyServiceCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderItemCreateManyServiceCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderItemCreateManyServiceCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyServiceCatalogInputEnvelope>;
export const OrderItemCreateManyServiceCatalogInputEnvelopeObjectZodSchema = makeSchema();
