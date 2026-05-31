import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';

export const PostTargetDeleteOneSchema: z.ZodType<Prisma.PostTargetDeleteArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PostTargetDeleteArgs>;

export const PostTargetDeleteOneZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), where: PostTargetWhereUniqueInputObjectSchema }).strict();