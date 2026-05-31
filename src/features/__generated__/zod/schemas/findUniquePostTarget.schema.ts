import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';

export const PostTargetFindUniqueSchema: z.ZodType<Prisma.PostTargetFindUniqueArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PostTargetFindUniqueArgs>;

export const PostTargetFindUniqueZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema }).strict();