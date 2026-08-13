import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './objects/CarrierStatusHistoryInclude.schema';
import { CarrierStatusHistoryUpdateInputObjectSchema as CarrierStatusHistoryUpdateInputObjectSchema } from './objects/CarrierStatusHistoryUpdateInput.schema';
import { CarrierStatusHistoryUncheckedUpdateInputObjectSchema as CarrierStatusHistoryUncheckedUpdateInputObjectSchema } from './objects/CarrierStatusHistoryUncheckedUpdateInput.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './objects/CarrierStatusHistoryWhereUniqueInput.schema';

export const CarrierStatusHistoryUpdateOneSchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), data: z.union([CarrierStatusHistoryUpdateInputObjectSchema, CarrierStatusHistoryUncheckedUpdateInputObjectSchema]), where: CarrierStatusHistoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateArgs>;

export const CarrierStatusHistoryUpdateOneZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), data: z.union([CarrierStatusHistoryUpdateInputObjectSchema, CarrierStatusHistoryUncheckedUpdateInputObjectSchema]), where: CarrierStatusHistoryWhereUniqueInputObjectSchema }).strict();