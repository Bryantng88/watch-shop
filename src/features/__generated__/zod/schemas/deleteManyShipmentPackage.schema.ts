import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './objects/ShipmentPackageWhereInput.schema';

export const ShipmentPackageDeleteManySchema: z.ZodType<Prisma.ShipmentPackageDeleteManyArgs> = z.object({ where: ShipmentPackageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageDeleteManyArgs>;

export const ShipmentPackageDeleteManyZodSchema = z.object({ where: ShipmentPackageWhereInputObjectSchema.optional() }).strict();