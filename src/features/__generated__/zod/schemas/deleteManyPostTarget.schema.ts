import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './objects/PostTargetWhereInput.schema';

export const PostTargetDeleteManySchema: z.ZodType<Prisma.PostTargetDeleteManyArgs> = z.object({ where: PostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetDeleteManyArgs>;

export const PostTargetDeleteManyZodSchema = z.object({ where: PostTargetWhereInputObjectSchema.optional() }).strict();