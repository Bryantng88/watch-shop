import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';

export const CarrierChargeDeleteOneSchema: z.ZodType<Prisma.CarrierChargeDeleteArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierChargeDeleteArgs>;

export const CarrierChargeDeleteOneZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema }).strict();