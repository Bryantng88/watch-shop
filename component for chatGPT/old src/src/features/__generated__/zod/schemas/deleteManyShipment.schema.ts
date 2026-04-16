import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './objects/ShipmentWhereInput.schema';

export const ShipmentDeleteManySchema: z.ZodType<Prisma.ShipmentDeleteManyArgs> = z.object({ where: ShipmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentDeleteManyArgs>;

export const ShipmentDeleteManyZodSchema = z.object({ where: ShipmentWhereInputObjectSchema.optional() }).strict();