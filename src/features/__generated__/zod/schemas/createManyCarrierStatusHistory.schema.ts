import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistoryCreateManyInputObjectSchema as CarrierStatusHistoryCreateManyInputObjectSchema } from './objects/CarrierStatusHistoryCreateManyInput.schema';

export const CarrierStatusHistoryCreateManySchema: z.ZodType<Prisma.CarrierStatusHistoryCreateManyArgs> = z.object({ data: z.union([ CarrierStatusHistoryCreateManyInputObjectSchema, z.array(CarrierStatusHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateManyArgs>;

export const CarrierStatusHistoryCreateManyZodSchema = z.object({ data: z.union([ CarrierStatusHistoryCreateManyInputObjectSchema, z.array(CarrierStatusHistoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();