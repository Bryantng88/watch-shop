import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './objects/CarrierStatusHistoryInclude.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './objects/CarrierStatusHistoryWhereUniqueInput.schema';

export const CarrierStatusHistoryFindUniqueSchema: z.ZodType<Prisma.CarrierStatusHistoryFindUniqueArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), where: CarrierStatusHistoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryFindUniqueArgs>;

export const CarrierStatusHistoryFindUniqueZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), where: CarrierStatusHistoryWhereUniqueInputObjectSchema }).strict();