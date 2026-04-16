import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './objects/AcquisitionSpecJobWhereInput.schema';

export const AcquisitionSpecJobDeleteManySchema: z.ZodType<Prisma.AcquisitionSpecJobDeleteManyArgs> = z.object({ where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobDeleteManyArgs>;

export const AcquisitionSpecJobDeleteManyZodSchema = z.object({ where: AcquisitionSpecJobWhereInputObjectSchema.optional() }).strict();