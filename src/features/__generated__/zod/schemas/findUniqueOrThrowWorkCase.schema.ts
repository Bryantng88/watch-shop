import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './objects/WorkCaseInclude.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';

export const WorkCaseFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkCaseFindUniqueOrThrowArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), where: WorkCaseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseFindUniqueOrThrowArgs>;

export const WorkCaseFindUniqueOrThrowZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), where: WorkCaseWhereUniqueInputObjectSchema }).strict();