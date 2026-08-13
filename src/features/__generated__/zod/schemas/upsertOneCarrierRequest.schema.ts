import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestCreateInputObjectSchema as CarrierRequestCreateInputObjectSchema } from './objects/CarrierRequestCreateInput.schema';
import { CarrierRequestUncheckedCreateInputObjectSchema as CarrierRequestUncheckedCreateInputObjectSchema } from './objects/CarrierRequestUncheckedCreateInput.schema';
import { CarrierRequestUpdateInputObjectSchema as CarrierRequestUpdateInputObjectSchema } from './objects/CarrierRequestUpdateInput.schema';
import { CarrierRequestUncheckedUpdateInputObjectSchema as CarrierRequestUncheckedUpdateInputObjectSchema } from './objects/CarrierRequestUncheckedUpdateInput.schema';

export const CarrierRequestUpsertOneSchema: z.ZodType<Prisma.CarrierRequestUpsertArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema, create: z.union([ CarrierRequestCreateInputObjectSchema, CarrierRequestUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierRequestUpdateInputObjectSchema, CarrierRequestUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CarrierRequestUpsertArgs>;

export const CarrierRequestUpsertOneZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema, create: z.union([ CarrierRequestCreateInputObjectSchema, CarrierRequestUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierRequestUpdateInputObjectSchema, CarrierRequestUncheckedUpdateInputObjectSchema ]) }).strict();