import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentUpdateManyMutationInputObjectSchema as ShipmentUpdateManyMutationInputObjectSchema } from './objects/ShipmentUpdateManyMutationInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './objects/ShipmentWhereInput.schema';

export const ShipmentUpdateManyAndReturnSchema: z.ZodType<Prisma.ShipmentUpdateManyAndReturnArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), data: ShipmentUpdateManyMutationInputObjectSchema, where: ShipmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentUpdateManyAndReturnArgs>;

export const ShipmentUpdateManyAndReturnZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), data: ShipmentUpdateManyMutationInputObjectSchema, where: ShipmentWhereInputObjectSchema.optional() }).strict();