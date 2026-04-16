import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';

export const AcquisitionFindUniqueSchema: z.ZodType<Prisma.AcquisitionFindUniqueArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionFindUniqueArgs>;

export const AcquisitionFindUniqueZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict();