import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogWhereInputObjectSchema as AcquisitionSpecJobLogWhereInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereInput.schema';

export const AcquisitionSpecJobLogDeleteManySchema: z.ZodType<Prisma.AcquisitionSpecJobLogDeleteManyArgs> = z.object({ where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogDeleteManyArgs>;

export const AcquisitionSpecJobLogDeleteManyZodSchema = z.object({ where: AcquisitionSpecJobLogWhereInputObjectSchema.optional() }).strict();