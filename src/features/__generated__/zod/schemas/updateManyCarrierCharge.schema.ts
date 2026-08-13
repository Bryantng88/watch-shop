import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeUpdateManyMutationInputObjectSchema as CarrierChargeUpdateManyMutationInputObjectSchema } from './objects/CarrierChargeUpdateManyMutationInput.schema';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './objects/CarrierChargeWhereInput.schema';

export const CarrierChargeUpdateManySchema: z.ZodType<Prisma.CarrierChargeUpdateManyArgs> = z.object({ data: CarrierChargeUpdateManyMutationInputObjectSchema, where: CarrierChargeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeUpdateManyArgs>;

export const CarrierChargeUpdateManyZodSchema = z.object({ data: CarrierChargeUpdateManyMutationInputObjectSchema, where: CarrierChargeWhereInputObjectSchema.optional() }).strict();