import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './objects/ShipmentPackageInclude.schema';
import { ShipmentPackageCreateInputObjectSchema as ShipmentPackageCreateInputObjectSchema } from './objects/ShipmentPackageCreateInput.schema';
import { ShipmentPackageUncheckedCreateInputObjectSchema as ShipmentPackageUncheckedCreateInputObjectSchema } from './objects/ShipmentPackageUncheckedCreateInput.schema';

export const ShipmentPackageCreateOneSchema: z.ZodType<Prisma.ShipmentPackageCreateArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), data: z.union([ShipmentPackageCreateInputObjectSchema, ShipmentPackageUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageCreateArgs>;

export const ShipmentPackageCreateOneZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), data: z.union([ShipmentPackageCreateInputObjectSchema, ShipmentPackageUncheckedCreateInputObjectSchema]) }).strict();