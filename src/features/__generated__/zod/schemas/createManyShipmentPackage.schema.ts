import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageCreateManyInputObjectSchema as ShipmentPackageCreateManyInputObjectSchema } from './objects/ShipmentPackageCreateManyInput.schema';

export const ShipmentPackageCreateManySchema: z.ZodType<Prisma.ShipmentPackageCreateManyArgs> = z.object({ data: z.union([ ShipmentPackageCreateManyInputObjectSchema, z.array(ShipmentPackageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageCreateManyArgs>;

export const ShipmentPackageCreateManyZodSchema = z.object({ data: z.union([ ShipmentPackageCreateManyInputObjectSchema, z.array(ShipmentPackageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();