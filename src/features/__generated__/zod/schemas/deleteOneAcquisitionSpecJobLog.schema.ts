import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './objects/AcquisitionSpecJobLogInclude.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereUniqueInput.schema';

export const AcquisitionSpecJobLogDeleteOneSchema: z.ZodType<Prisma.AcquisitionSpecJobLogDeleteArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogDeleteArgs>;

export const AcquisitionSpecJobLogDeleteOneZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema }).strict();