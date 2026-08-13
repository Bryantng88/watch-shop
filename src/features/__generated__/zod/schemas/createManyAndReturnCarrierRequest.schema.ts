import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestCreateManyInputObjectSchema as CarrierRequestCreateManyInputObjectSchema } from './objects/CarrierRequestCreateManyInput.schema';

export const CarrierRequestCreateManyAndReturnSchema: z.ZodType<Prisma.CarrierRequestCreateManyAndReturnArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), data: z.union([ CarrierRequestCreateManyInputObjectSchema, z.array(CarrierRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestCreateManyAndReturnArgs>;

export const CarrierRequestCreateManyAndReturnZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), data: z.union([ CarrierRequestCreateManyInputObjectSchema, z.array(CarrierRequestCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();