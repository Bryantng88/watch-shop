import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './objects/CarrierChargeWhereInput.schema';

export const CarrierChargeDeleteManySchema: z.ZodType<Prisma.CarrierChargeDeleteManyArgs> = z.object({ where: CarrierChargeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeDeleteManyArgs>;

export const CarrierChargeDeleteManyZodSchema = z.object({ where: CarrierChargeWhereInputObjectSchema.optional() }).strict();