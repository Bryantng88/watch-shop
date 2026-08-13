import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeCreateInputObjectSchema as CarrierChargeCreateInputObjectSchema } from './objects/CarrierChargeCreateInput.schema';
import { CarrierChargeUncheckedCreateInputObjectSchema as CarrierChargeUncheckedCreateInputObjectSchema } from './objects/CarrierChargeUncheckedCreateInput.schema';
import { CarrierChargeUpdateInputObjectSchema as CarrierChargeUpdateInputObjectSchema } from './objects/CarrierChargeUpdateInput.schema';
import { CarrierChargeUncheckedUpdateInputObjectSchema as CarrierChargeUncheckedUpdateInputObjectSchema } from './objects/CarrierChargeUncheckedUpdateInput.schema';

export const CarrierChargeUpsertOneSchema: z.ZodType<Prisma.CarrierChargeUpsertArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema, create: z.union([ CarrierChargeCreateInputObjectSchema, CarrierChargeUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierChargeUpdateInputObjectSchema, CarrierChargeUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CarrierChargeUpsertArgs>;

export const CarrierChargeUpsertOneZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema, create: z.union([ CarrierChargeCreateInputObjectSchema, CarrierChargeUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierChargeUpdateInputObjectSchema, CarrierChargeUncheckedUpdateInputObjectSchema ]) }).strict();