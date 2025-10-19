import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './objects/AcquisitionWhereInput.schema';

export const AcquisitionDeleteManySchema: z.ZodType<Prisma.AcquisitionDeleteManyArgs> = z.object({ where: AcquisitionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionDeleteManyArgs>;

export const AcquisitionDeleteManyZodSchema = z.object({ where: AcquisitionWhereInputObjectSchema.optional() }).strict();