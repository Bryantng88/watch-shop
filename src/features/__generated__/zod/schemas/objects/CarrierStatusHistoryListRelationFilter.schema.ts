import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryWhereInputObjectSchema as CarrierStatusHistoryWhereInputObjectSchema } from './CarrierStatusHistoryWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).optional(),
  some: z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).optional(),
  none: z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).optional()
}).strict();
export const CarrierStatusHistoryListRelationFilterObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryListRelationFilter>;
export const CarrierStatusHistoryListRelationFilterObjectZodSchema = makeSchema();
