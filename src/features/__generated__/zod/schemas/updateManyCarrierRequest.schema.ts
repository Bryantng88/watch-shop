import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestUpdateManyMutationInputObjectSchema as CarrierRequestUpdateManyMutationInputObjectSchema } from './objects/CarrierRequestUpdateManyMutationInput.schema';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './objects/CarrierRequestWhereInput.schema';

export const CarrierRequestUpdateManySchema: z.ZodType<Prisma.CarrierRequestUpdateManyArgs> = z.object({ data: CarrierRequestUpdateManyMutationInputObjectSchema, where: CarrierRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestUpdateManyArgs>;

export const CarrierRequestUpdateManyZodSchema = z.object({ data: CarrierRequestUpdateManyMutationInputObjectSchema, where: CarrierRequestWhereInputObjectSchema.optional() }).strict();