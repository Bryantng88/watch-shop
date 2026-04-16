import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionUpdateInputObjectSchema as AcquisitionUpdateInputObjectSchema } from './objects/AcquisitionUpdateInput.schema';
import { AcquisitionUncheckedUpdateInputObjectSchema as AcquisitionUncheckedUpdateInputObjectSchema } from './objects/AcquisitionUncheckedUpdateInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';

export const AcquisitionUpdateOneSchema: z.ZodType<Prisma.AcquisitionUpdateArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), data: z.union([AcquisitionUpdateInputObjectSchema, AcquisitionUncheckedUpdateInputObjectSchema]), where: AcquisitionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionUpdateArgs>;

export const AcquisitionUpdateOneZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), data: z.union([AcquisitionUpdateInputObjectSchema, AcquisitionUncheckedUpdateInputObjectSchema]), where: AcquisitionWhereUniqueInputObjectSchema }).strict();