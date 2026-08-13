import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './objects/CarrierStatusHistoryInclude.schema';
import { CarrierStatusHistoryCreateInputObjectSchema as CarrierStatusHistoryCreateInputObjectSchema } from './objects/CarrierStatusHistoryCreateInput.schema';
import { CarrierStatusHistoryUncheckedCreateInputObjectSchema as CarrierStatusHistoryUncheckedCreateInputObjectSchema } from './objects/CarrierStatusHistoryUncheckedCreateInput.schema';

export const CarrierStatusHistoryCreateOneSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), data: z.union([CarrierStatusHistoryCreateInputObjectSchema, CarrierStatusHistoryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateArgs>;

export const CarrierStatusHistoryCreateOneZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), data: z.union([CarrierStatusHistoryCreateInputObjectSchema, CarrierStatusHistoryUncheckedCreateInputObjectSchema]) }).strict();