import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CategorySchema } from '../enums/Category.schema'

const makeSchema = () => z.object({
  set: CategorySchema.array().optional(),
  push: z.union([CategorySchema, CategorySchema.array()]).optional()
}).strict();
export const WatchSpecUpdatecategoryInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdatecategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdatecategoryInput>;
export const WatchSpecUpdatecategoryInputObjectZodSchema = makeSchema();
