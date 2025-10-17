import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CategorySchema } from '../enums/Category.schema'

const makeSchema = () => z.object({
  set: CategorySchema.array()
}).strict();
export const WatchSpecCreatecategoryInputObjectSchema: z.ZodType<Prisma.WatchSpecCreatecategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreatecategoryInput>;
export const WatchSpecCreatecategoryInputObjectZodSchema = makeSchema();
