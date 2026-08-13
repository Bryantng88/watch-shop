import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeUpdateInputObjectSchema as CarrierChargeUpdateInputObjectSchema } from './objects/CarrierChargeUpdateInput.schema';
import { CarrierChargeUncheckedUpdateInputObjectSchema as CarrierChargeUncheckedUpdateInputObjectSchema } from './objects/CarrierChargeUncheckedUpdateInput.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';

export const CarrierChargeUpdateOneSchema: z.ZodType<Prisma.CarrierChargeUpdateArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), data: z.union([CarrierChargeUpdateInputObjectSchema, CarrierChargeUncheckedUpdateInputObjectSchema]), where: CarrierChargeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierChargeUpdateArgs>;

export const CarrierChargeUpdateOneZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), data: z.union([CarrierChargeUpdateInputObjectSchema, CarrierChargeUncheckedUpdateInputObjectSchema]), where: CarrierChargeWhereUniqueInputObjectSchema }).strict();