import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ReservationIncludeObjectSchema: z.ZodType<Prisma.ReservationInclude> = makeSchema() as unknown as z.ZodType<Prisma.ReservationInclude>;
export const ReservationIncludeObjectZodSchema = makeSchema();
