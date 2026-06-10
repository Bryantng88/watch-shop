import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './objects/WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';

export const WorkCaseUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseUpdateManyAndReturnArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), data: WorkCaseUpdateManyMutationInputObjectSchema, where: WorkCaseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyAndReturnArgs>;

export const WorkCaseUpdateManyAndReturnZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), data: WorkCaseUpdateManyMutationInputObjectSchema, where: WorkCaseWhereInputObjectSchema.optional() }).strict();