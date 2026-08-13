import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageUpdateManyMutationInputObjectSchema as ShipmentPackageUpdateManyMutationInputObjectSchema } from './objects/ShipmentPackageUpdateManyMutationInput.schema';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './objects/ShipmentPackageWhereInput.schema';

export const ShipmentPackageUpdateManySchema: z.ZodType<Prisma.ShipmentPackageUpdateManyArgs> = z.object({ data: ShipmentPackageUpdateManyMutationInputObjectSchema, where: ShipmentPackageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageUpdateManyArgs>;

export const ShipmentPackageUpdateManyZodSchema = z.object({ data: ShipmentPackageUpdateManyMutationInputObjectSchema, where: ShipmentPackageWhereInputObjectSchema.optional() }).strict();