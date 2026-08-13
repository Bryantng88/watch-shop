import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryUpdateManyMutationInputObjectSchema as CarrierStatusHistoryUpdateManyMutationInputObjectSchema } from './objects/CarrierStatusHistoryUpdateManyMutationInput.schema';
import { CarrierStatusHistoryWhereInputObjectSchema as CarrierStatusHistoryWhereInputObjectSchema } from './objects/CarrierStatusHistoryWhereInput.schema';

export const CarrierStatusHistoryUpdateManyAndReturnSchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateManyAndReturnArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), data: CarrierStatusHistoryUpdateManyMutationInputObjectSchema, where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateManyAndReturnArgs>;

export const CarrierStatusHistoryUpdateManyAndReturnZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), data: CarrierStatusHistoryUpdateManyMutationInputObjectSchema, where: CarrierStatusHistoryWhereInputObjectSchema.optional() }).strict();