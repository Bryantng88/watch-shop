import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './objects/CarrierStatusHistoryInclude.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './objects/CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryCreateInputObjectSchema as CarrierStatusHistoryCreateInputObjectSchema } from './objects/CarrierStatusHistoryCreateInput.schema';
import { CarrierStatusHistoryUncheckedCreateInputObjectSchema as CarrierStatusHistoryUncheckedCreateInputObjectSchema } from './objects/CarrierStatusHistoryUncheckedCreateInput.schema';
import { CarrierStatusHistoryUpdateInputObjectSchema as CarrierStatusHistoryUpdateInputObjectSchema } from './objects/CarrierStatusHistoryUpdateInput.schema';
import { CarrierStatusHistoryUncheckedUpdateInputObjectSchema as CarrierStatusHistoryUncheckedUpdateInputObjectSchema } from './objects/CarrierStatusHistoryUncheckedUpdateInput.schema';

export const CarrierStatusHistoryUpsertOneSchema: z.ZodType<Prisma.CarrierStatusHistoryUpsertArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), where: CarrierStatusHistoryWhereUniqueInputObjectSchema, create: z.union([ CarrierStatusHistoryCreateInputObjectSchema, CarrierStatusHistoryUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierStatusHistoryUpdateInputObjectSchema, CarrierStatusHistoryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpsertArgs>;

export const CarrierStatusHistoryUpsertOneZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), where: CarrierStatusHistoryWhereUniqueInputObjectSchema, create: z.union([ CarrierStatusHistoryCreateInputObjectSchema, CarrierStatusHistoryUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierStatusHistoryUpdateInputObjectSchema, CarrierStatusHistoryUncheckedUpdateInputObjectSchema ]) }).strict();