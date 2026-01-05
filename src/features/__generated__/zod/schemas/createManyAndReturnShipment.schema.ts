import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentCreateManyInputObjectSchema as ShipmentCreateManyInputObjectSchema } from './objects/ShipmentCreateManyInput.schema';

export const ShipmentCreateManyAndReturnSchema: z.ZodType<Prisma.ShipmentCreateManyAndReturnArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), data: z.union([ ShipmentCreateManyInputObjectSchema, z.array(ShipmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentCreateManyAndReturnArgs>;

export const ShipmentCreateManyAndReturnZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), data: z.union([ ShipmentCreateManyInputObjectSchema, z.array(ShipmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();