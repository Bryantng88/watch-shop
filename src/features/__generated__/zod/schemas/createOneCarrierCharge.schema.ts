import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeCreateInputObjectSchema as CarrierChargeCreateInputObjectSchema } from './objects/CarrierChargeCreateInput.schema';
import { CarrierChargeUncheckedCreateInputObjectSchema as CarrierChargeUncheckedCreateInputObjectSchema } from './objects/CarrierChargeUncheckedCreateInput.schema';

export const CarrierChargeCreateOneSchema: z.ZodType<Prisma.CarrierChargeCreateArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), data: z.union([CarrierChargeCreateInputObjectSchema, CarrierChargeUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CarrierChargeCreateArgs>;

export const CarrierChargeCreateOneZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), data: z.union([CarrierChargeCreateInputObjectSchema, CarrierChargeUncheckedCreateInputObjectSchema]) }).strict();