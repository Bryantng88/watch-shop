import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './objects/ShipmentPackageSelect.schema';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './objects/ShipmentPackageInclude.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './objects/ShipmentPackageWhereUniqueInput.schema';

export const ShipmentPackageFindUniqueOrThrowSchema: z.ZodType<Prisma.ShipmentPackageFindUniqueOrThrowArgs> = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), where: ShipmentPackageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageFindUniqueOrThrowArgs>;

export const ShipmentPackageFindUniqueOrThrowZodSchema = z.object({ select: ShipmentPackageSelectObjectSchema.optional(), include: ShipmentPackageIncludeObjectSchema.optional(), where: ShipmentPackageWhereUniqueInputObjectSchema }).strict();