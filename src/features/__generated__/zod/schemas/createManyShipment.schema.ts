import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentCreateManyInputObjectSchema as ShipmentCreateManyInputObjectSchema } from './objects/ShipmentCreateManyInput.schema';

export const ShipmentCreateManySchema: z.ZodType<Prisma.ShipmentCreateManyArgs> = z.object({ data: z.union([ ShipmentCreateManyInputObjectSchema, z.array(ShipmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentCreateManyArgs>;

export const ShipmentCreateManyZodSchema = z.object({ data: z.union([ ShipmentCreateManyInputObjectSchema, z.array(ShipmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();