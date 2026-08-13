import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './objects/ShipmentPackageInclude.schema';
import { ShipmentPackageUpdateInputObjectSchema as ShipmentPackageUpdateInputObjectSchema } from './objects/ShipmentPackageUpdateInput.schema';
import { ShipmentPackageUncheckedUpdateInputObjectSchema as ShipmentPackageUncheckedUpdateInputObjectSchema } from './objects/ShipmentPackageUncheckedUpdateInput.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './objects/ShipmentPackageWhereUniqueInput.schema';

export const ShipmentPackageUpdateOneSchema: z.ZodType<Prisma.ShipmentPackageUpdateArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), data: z.union([ShipmentPackageUpdateInputObjectSchema, ShipmentPackageUncheckedUpdateInputObjectSchema]), where: ShipmentPackageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageUpdateArgs>;

export const ShipmentPackageUpdateOneZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), data: z.union([ShipmentPackageUpdateInputObjectSchema, ShipmentPackageUncheckedUpdateInputObjectSchema]), where: ShipmentPackageWhereUniqueInputObjectSchema }).strict();