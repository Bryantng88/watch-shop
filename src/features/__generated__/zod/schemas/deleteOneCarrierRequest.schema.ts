import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';

export const CarrierRequestDeleteOneSchema: z.ZodType<Prisma.CarrierRequestDeleteArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierRequestDeleteArgs>;

export const CarrierRequestDeleteOneZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema }).strict();