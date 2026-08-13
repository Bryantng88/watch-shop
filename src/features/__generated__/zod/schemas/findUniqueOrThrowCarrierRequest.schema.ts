import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';

export const CarrierRequestFindUniqueOrThrowSchema: z.ZodType<Prisma.CarrierRequestFindUniqueOrThrowArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierRequestFindUniqueOrThrowArgs>;

export const CarrierRequestFindUniqueOrThrowZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), where: CarrierRequestWhereUniqueInputObjectSchema }).strict();