import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './objects/AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';

export const AcquisitionFindUniqueOrThrowSchema: z.ZodType<Prisma.AcquisitionFindUniqueOrThrowArgs> = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AcquisitionFindUniqueOrThrowArgs>;

export const AcquisitionFindUniqueOrThrowZodSchema = z.object({ select: AcquisitionSelectObjectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), where: AcquisitionWhereUniqueInputObjectSchema }).strict();