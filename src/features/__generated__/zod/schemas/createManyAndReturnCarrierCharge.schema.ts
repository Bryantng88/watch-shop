import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeCreateManyInputObjectSchema as CarrierChargeCreateManyInputObjectSchema } from './objects/CarrierChargeCreateManyInput.schema';

export const CarrierChargeCreateManyAndReturnSchema: z.ZodType<Prisma.CarrierChargeCreateManyAndReturnArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), data: z.union([ CarrierChargeCreateManyInputObjectSchema, z.array(CarrierChargeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeCreateManyAndReturnArgs>;

export const CarrierChargeCreateManyAndReturnZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), data: z.union([ CarrierChargeCreateManyInputObjectSchema, z.array(CarrierChargeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();