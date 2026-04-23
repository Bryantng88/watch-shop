import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './objects/AcquisitionSpecJobLogInclude.schema';
import { AcquisitionSpecJobLogUpdateInputObjectSchema as AcquisitionSpecJobLogUpdateInputObjectSchema } from './objects/AcquisitionSpecJobLogUpdateInput.schema';
import { AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema as AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema } from './objects/AcquisitionSpecJobLogUncheckedUpdateInput.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './objects/AcquisitionSpecJobLogWhereUniqueInput.schema';

export const AcquisitionSpecJobLogUpdateOneSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUpdateArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobLogUpdateInputObjectSchema, AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema]), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUpdateArgs>;

export const AcquisitionSpecJobLogUpdateOneZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), include: AcquisitionSpecJobLogIncludeObjectSchema.optional(), data: z.union([AcquisitionSpecJobLogUpdateInputObjectSchema, AcquisitionSpecJobLogUncheckedUpdateInputObjectSchema]), where: AcquisitionSpecJobLogWhereUniqueInputObjectSchema }).strict();