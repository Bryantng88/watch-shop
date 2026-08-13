import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistoryWhereInputObjectSchema as CarrierStatusHistoryWhereInputObjectSchema } from './objects/CarrierStatusHistoryWhereInput.schema';

export const CarrierStatusHistoryDeleteManySchema: z.ZodType<Prisma.CarrierStatusHistoryDeleteManyArgs> = z.object({ where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryDeleteManyArgs>;

export const CarrierStatusHistoryDeleteManyZodSchema = z.object({ where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict();