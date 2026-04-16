import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentUpdateManyMutationInputObjectSchema as ShipmentUpdateManyMutationInputObjectSchema } from './objects/ShipmentUpdateManyMutationInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './objects/ShipmentWhereInput.schema';

export const ShipmentUpdateManySchema: z.ZodType<Prisma.ShipmentUpdateManyArgs> = z.object({ data: ShipmentUpdateManyMutationInputObjectSchema, where: ShipmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentUpdateManyArgs>;

export const ShipmentUpdateManyZodSchema = z.object({ data: ShipmentUpdateManyMutationInputObjectSchema, where: ShipmentWhereInputObjectSchema.optional() }).strict();