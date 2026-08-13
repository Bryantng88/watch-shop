import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeCreateManyInputObjectSchema as CarrierChargeCreateManyInputObjectSchema } from './objects/CarrierChargeCreateManyInput.schema';

export const CarrierChargeCreateManySchema: z.ZodType<Prisma.CarrierChargeCreateManyArgs> = z.object({ data: z.union([ CarrierChargeCreateManyInputObjectSchema, z.array(CarrierChargeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeCreateManyArgs>;

export const CarrierChargeCreateManyZodSchema = z.object({ data: z.union([ CarrierChargeCreateManyInputObjectSchema, z.array(CarrierChargeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();