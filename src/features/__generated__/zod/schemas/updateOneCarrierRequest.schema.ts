import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestUpdateInputObjectSchema as CarrierRequestUpdateInputObjectSchema } from './objects/CarrierRequestUpdateInput.schema';
import { CarrierRequestUncheckedUpdateInputObjectSchema as CarrierRequestUncheckedUpdateInputObjectSchema } from './objects/CarrierRequestUncheckedUpdateInput.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';

export const CarrierRequestUpdateOneSchema: z.ZodType<Prisma.CarrierRequestUpdateArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), data: z.union([CarrierRequestUpdateInputObjectSchema, CarrierRequestUncheckedUpdateInputObjectSchema]), where: CarrierRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierRequestUpdateArgs>;

export const CarrierRequestUpdateOneZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), data: z.union([CarrierRequestUpdateInputObjectSchema, CarrierRequestUncheckedUpdateInputObjectSchema]), where: CarrierRequestWhereUniqueInputObjectSchema }).strict();