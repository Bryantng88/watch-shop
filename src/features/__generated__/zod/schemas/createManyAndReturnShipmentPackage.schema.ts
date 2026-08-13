import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageCreateManyInputObjectSchema as ShipmentPackageCreateManyInputObjectSchema } from './objects/ShipmentPackageCreateManyInput.schema';

export const ShipmentPackageCreateManyAndReturnSchema: z.ZodType<Prisma.ShipmentPackageCreateManyAndReturnArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), data: z.union([ ShipmentPackageCreateManyInputObjectSchema, z.array(ShipmentPackageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageCreateManyAndReturnArgs>;

export const ShipmentPackageCreateManyAndReturnZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), data: z.union([ ShipmentPackageCreateManyInputObjectSchema, z.array(ShipmentPackageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();