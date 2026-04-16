import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentUpdateInputObjectSchema as ShipmentUpdateInputObjectSchema } from './objects/ShipmentUpdateInput.schema';
import { ShipmentUncheckedUpdateInputObjectSchema as ShipmentUncheckedUpdateInputObjectSchema } from './objects/ShipmentUncheckedUpdateInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';

export const ShipmentUpdateOneSchema: z.ZodType<Prisma.ShipmentUpdateArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), data: z.union([ShipmentUpdateInputObjectSchema, ShipmentUncheckedUpdateInputObjectSchema]), where: ShipmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentUpdateArgs>;

export const ShipmentUpdateOneZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), data: z.union([ShipmentUpdateInputObjectSchema, ShipmentUncheckedUpdateInputObjectSchema]), where: ShipmentWhereUniqueInputObjectSchema }).strict();