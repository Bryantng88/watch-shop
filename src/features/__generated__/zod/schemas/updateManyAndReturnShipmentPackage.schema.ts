import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageUpdateManyMutationInputObjectSchema as ShipmentPackageUpdateManyMutationInputObjectSchema } from './objects/ShipmentPackageUpdateManyMutationInput.schema';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './objects/ShipmentPackageWhereInput.schema';

export const ShipmentPackageUpdateManyAndReturnSchema: z.ZodType<Prisma.ShipmentPackageUpdateManyAndReturnArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), data: ShipmentPackageUpdateManyMutationInputObjectSchema, where: ShipmentPackageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageUpdateManyAndReturnArgs>;

export const ShipmentPackageUpdateManyAndReturnZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), data: ShipmentPackageUpdateManyMutationInputObjectSchema, where: ShipmentPackageWhereInputObjectSchema.optional() }).strict();