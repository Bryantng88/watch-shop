import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema'

const nestedenumshipmentstatusfilterSchema = z.object({
  equals: shipmentstatusSchema.optional(),
  in: shipmentstatusSchema.array().optional(),
  notIn: shipmentstatusSchema.array().optional(),
  not: z.union([shipmentstatusSchema, z.lazy(() => NestedEnumshipmentstatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumshipmentstatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumshipmentstatusFilter> = nestedenumshipmentstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumshipmentstatusFilter>;
export const NestedEnumshipmentstatusFilterObjectZodSchema = nestedenumshipmentstatusfilterSchema;
