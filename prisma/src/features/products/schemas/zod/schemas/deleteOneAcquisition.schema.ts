import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';

export const AcquisitionDeleteOneSchema: z.ZodType<Prisma.AcquisitionDeleteArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionDeleteArgs>;

export const AcquisitionDeleteOneZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict();