import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './objects/ShipmentPackageInclude.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './objects/ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageCreateInputObjectSchema as ShipmentPackageCreateInputObjectSchema } from './objects/ShipmentPackageCreateInput.schema';
import { ShipmentPackageUncheckedCreateInputObjectSchema as ShipmentPackageUncheckedCreateInputObjectSchema } from './objects/ShipmentPackageUncheckedCreateInput.schema';
import { ShipmentPackageUpdateInputObjectSchema as ShipmentPackageUpdateInputObjectSchema } from './objects/ShipmentPackageUpdateInput.schema';
import { ShipmentPackageUncheckedUpdateInputObjectSchema as ShipmentPackageUncheckedUpdateInputObjectSchema } from './objects/ShipmentPackageUncheckedUpdateInput.schema';

export const ShipmentPackageUpsertOneSchema: z.ZodType<Prisma.ShipmentPackageUpsertArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), where: ShipmentPackageWhereUniqueInputObjectSchema, create: z.union([ ShipmentPackageCreateInputObjectSchema, ShipmentPackageUncheckedCreateInputObjectSchema ]), update: z.union([ ShipmentPackageUpdateInputObjectSchema, ShipmentPackageUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageUpsertArgs>;

export const ShipmentPackageUpsertOneZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), where: ShipmentPackageWhereUniqueInputObjectSchema, create: z.union([ ShipmentPackageCreateInputObjectSchema, ShipmentPackageUncheckedCreateInputObjectSchema ]), update: z.union([ ShipmentPackageUpdateInputObjectSchema, ShipmentPackageUncheckedUpdateInputObjectSchema ]) }).strict();