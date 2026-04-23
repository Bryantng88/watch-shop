import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './objects/AcquisitionSpecJobLogInclude.schema';
import { AcquisitionSpecJobLogCreateInputObjectSchema as AcquisitionSpecJobLogCreateInputObjectSchema } from './objects/AcquisitionSpecJobLogCreateInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateInputObjectSchema } from './objects/AcquisitionSpecJobLogUncheckedCreateInput.schema';

export const AcquisitionSpecJobLogCreateOneSchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobLogCreateInputObjectSchema, AcquisitionSpecJobLogUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateArgs>;

export const AcquisitionSpecJobLogCreateOneZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobLogCreateInputObjectSchema, AcquisitionSpecJobLogUncheckedCreateInputObjectSchema]) }).strict();