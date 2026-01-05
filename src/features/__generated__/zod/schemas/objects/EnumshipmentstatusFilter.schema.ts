import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema';
import { NestedEnumshipmentstatusFilterObjectSchema as NestedEnumshipmentstatusFilterObjectSchema } from './NestedEnumshipmentstatusFilter.schema'

const makeSchema = () => z.object({
  equals: shipmentstatusSchema.optional(),
  in: shipmentstatusSchema.array().optional(),
  notIn: shipmentstatusSchema.array().optional(),
  not: z.union([shipmentstatusSchema, z.lazy(() => NestedEnumshipmentstatusFilterObjectSchema)]).optional()
}).strict();
export const EnumshipmentstatusFilterObjectSchema: z.ZodType<Prisma.EnumshipmentstatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumshipmentstatusFilter>;
export const EnumshipmentstatusFilterObjectZodSchema = makeSchema();
