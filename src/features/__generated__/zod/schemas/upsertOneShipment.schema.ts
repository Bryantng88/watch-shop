import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';
import { ShipmentCreateInputObjectSchema as ShipmentCreateInputObjectSchema } from './objects/ShipmentCreateInput.schema';
import { ShipmentUncheckedCreateInputObjectSchema as ShipmentUncheckedCreateInputObjectSchema } from './objects/ShipmentUncheckedCreateInput.schema';
import { ShipmentUpdateInputObjectSchema as ShipmentUpdateInputObjectSchema } from './objects/ShipmentUpdateInput.schema';
import { ShipmentUncheckedUpdateInputObjectSchema as ShipmentUncheckedUpdateInputObjectSchema } from './objects/ShipmentUncheckedUpdateInput.schema';

export const ShipmentUpsertOneSchema: z.ZodType<Prisma.ShipmentUpsertArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema, create: z.union([ ShipmentCreateInputObjectSchema, ShipmentUncheckedCreateInputObjectSchema ]), update: z.union([ ShipmentUpdateInputObjectSchema, ShipmentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ShipmentUpsertArgs>;

export const ShipmentUpsertOneZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema, create: z.union([ ShipmentCreateInputObjectSchema, ShipmentUncheckedCreateInputObjectSchema ]), update: z.union([ ShipmentUpdateInputObjectSchema, ShipmentUncheckedUpdateInputObjectSchema ]) }).strict();