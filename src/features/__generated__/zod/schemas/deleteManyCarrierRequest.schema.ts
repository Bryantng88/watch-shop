import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './objects/CarrierRequestWhereInput.schema';

export const CarrierRequestDeleteManySchema: z.ZodType<Prisma.CarrierRequestDeleteManyArgs> = z.object({ where: CarrierRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestDeleteManyArgs>;

export const CarrierRequestDeleteManyZodSchema = z.object({ where: CarrierRequestWhereInputObjectSchema.optional() }).strict();