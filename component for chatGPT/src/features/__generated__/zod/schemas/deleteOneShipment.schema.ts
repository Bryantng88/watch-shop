import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';

export const ShipmentDeleteOneSchema: z.ZodType<Prisma.ShipmentDeleteArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentDeleteArgs>;

export const ShipmentDeleteOneZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict();