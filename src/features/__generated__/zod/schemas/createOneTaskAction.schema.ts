import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionCreateInputObjectSchema as TaskActionCreateInputObjectSchema } from './objects/TaskActionCreateInput.schema';
import { TaskActionUncheckedCreateInputObjectSchema as TaskActionUncheckedCreateInputObjectSchema } from './objects/TaskActionUncheckedCreateInput.schema';

export const TaskActionCreateOneSchema: z.ZodType<Prisma.TaskActionCreateArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), data: z.union([TaskActionCreateInputObjectSchema, TaskActionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskActionCreateArgs>;

export const TaskActionCreateOneZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), data: z.union([TaskActionCreateInputObjectSchema, TaskActionUncheckedCreateInputObjectSchema]) }).strict();