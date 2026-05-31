import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const PostTargetWhereUniqueInputObjectSchema: z.ZodType<Prisma.PostTargetWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetWhereUniqueInput>;
export const PostTargetWhereUniqueInputObjectZodSchema = makeSchema();
