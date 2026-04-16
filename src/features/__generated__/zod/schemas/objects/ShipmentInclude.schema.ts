import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema'

const makeSchema = () => z.object({
  Order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional()
}).strict();
export const ShipmentIncludeObjectSchema: z.ZodType<Prisma.ShipmentInclude> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentInclude>;
export const ShipmentIncludeObjectZodSchema = makeSchema();
