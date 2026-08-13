import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestCreateManyInputObjectSchema as CarrierRequestCreateManyInputObjectSchema } from './objects/CarrierRequestCreateManyInput.schema';

export const CarrierRequestCreateManySchema: z.ZodType<Prisma.CarrierRequestCreateManyArgs> = z.object({ data: z.union([ CarrierRequestCreateManyInputObjectSchema, z.array(CarrierRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestCreateManyArgs>;

export const CarrierRequestCreateManyZodSchema = z.object({ data: z.union([ CarrierRequestCreateManyInputObjectSchema, z.array(CarrierRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();