import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './objects/AcquisitionSpecJobInclude.schema';
import { AcquisitionSpecJobWhereUniqueInputObjectSchema as AcquisitionSpecJobWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobWhereUniqueInput.schema';

export const AcquisitionSpecJobFindUniqueSchema: z.ZodType<Prisma.AcquisitionSpecJobFindUniqueArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), where: AcquisitionSpecJobWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobFindUniqueArgs>;

export const AcquisitionSpecJobFindUniqueZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), include: AcquisitionSpecJobIncludeObjectSchema.optional(), where: AcquisitionSpecJobWhereUniqueInputObjectSchema }).strict();