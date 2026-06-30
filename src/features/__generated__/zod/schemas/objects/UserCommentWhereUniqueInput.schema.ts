import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const UserCommentWhereUniqueInputObjectSchema: z.ZodType<Prisma.UserCommentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentWhereUniqueInput>;
export const UserCommentWhereUniqueInputObjectZodSchema = makeSchema();
