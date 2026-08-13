import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeUpdateManyMutationInputObjectSchema as CarrierChargeUpdateManyMutationInputObjectSchema } from './objects/CarrierChargeUpdateManyMutationInput.schema';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './objects/CarrierChargeWhereInput.schema';

export const CarrierChargeUpdateManyAndReturnSchema: z.ZodType<Prisma.CarrierChargeUpdateManyAndReturnArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), data: CarrierChargeUpdateManyMutationInputObjectSchema, where: CarrierChargeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeUpdateManyAndReturnArgs>;

export const CarrierChargeUpdateManyAndReturnZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), data: CarrierChargeUpdateManyMutationInputObjectSchema, where: CarrierChargeWhereInputObjectSchema.optional() }).strict();