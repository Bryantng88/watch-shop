import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistoryUpdateManyMutationInputObjectSchema as CarrierStatusHistoryUpdateManyMutationInputObjectSchema } from './objects/CarrierStatusHistoryUpdateManyMutationInput.schema';
import { CarrierStatusHistoryWhereInputObjectSchema as CarrierStatusHistoryWhereInputObjectSchema } from './objects/CarrierStatusHistoryWhereInput.schema';

export const CarrierStatusHistoryUpdateManySchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateManyArgs> = z.object({ data: CarrierStatusHistoryUpdateManyMutationInputObjectSchema, where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateManyArgs>;

export const CarrierStatusHistoryUpdateManyZodSchema = z.object({ data: CarrierStatusHistoryUpdateManyMutationInputObjectSchema, where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict();