import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './objects/AcquisitionItemWhereInput.schema';

export const AcquisitionItemDeleteManySchema: z.ZodType<Prisma.AcquisitionItemDeleteManyArgs> = z.object({ where: AcquisitionItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemDeleteManyArgs>;

export const AcquisitionItemDeleteManyZodSchema = z.object({ where: AcquisitionItemWhereInputObjectSchema.optional() }).strict();