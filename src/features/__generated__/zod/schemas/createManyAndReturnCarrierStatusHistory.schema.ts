import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './objects/CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryCreateManyInputObjectSchema as CarrierStatusHistoryCreateManyInputObjectSchema } from './objects/CarrierStatusHistoryCreateManyInput.schema';

export const CarrierStatusHistoryCreateManyAndReturnSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateManyAndReturnArgs> = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), data: z.union([ CarrierStatusHistoryCreateManyInputObjectSchema, z.array(CarrierStatusHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateManyAndReturnArgs>;

export const CarrierStatusHistoryCreateManyAndReturnZodSchema = z.object({ select: CarrierStatusHistorySelectObjectSchema.optional(), data: z.union([ CarrierStatusHistoryCreateManyInputObjectSchema, z.array(CarrierStatusHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();