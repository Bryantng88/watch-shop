import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestCreateInputObjectSchema as CarrierRequestCreateInputObjectSchema } from './objects/CarrierRequestCreateInput.schema';
import { CarrierRequestUncheckedCreateInputObjectSchema as CarrierRequestUncheckedCreateInputObjectSchema } from './objects/CarrierRequestUncheckedCreateInput.schema';

export const CarrierRequestCreateOneSchema: z.ZodType<Prisma.CarrierRequestCreateArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), data: z.union([CarrierRequestCreateInputObjectSchema, CarrierRequestUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CarrierRequestCreateArgs>;

export const CarrierRequestCreateOneZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), data: z.union([CarrierRequestCreateInputObjectSchema, CarrierRequestUncheckedCreateInputObjectSchema]) }).strict();