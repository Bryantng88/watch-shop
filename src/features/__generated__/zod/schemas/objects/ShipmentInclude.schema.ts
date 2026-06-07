import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { ShipmentCountOutputTypeArgsObjectSchema as ShipmentCountOutputTypeArgsObjectSchema } from './ShipmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  Task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ShipmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ShipmentIncludeObjectSchema: z.ZodType<Prisma.ShipmentInclude> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentInclude>;
export const ShipmentIncludeObjectZodSchema = makeSchema();
