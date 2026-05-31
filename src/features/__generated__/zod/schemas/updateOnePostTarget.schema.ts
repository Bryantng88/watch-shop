import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetUpdateInputObjectSchema as PostTargetUpdateInputObjectSchema } from './objects/PostTargetUpdateInput.schema';
import { PostTargetUncheckedUpdateInputObjectSchema as PostTargetUncheckedUpdateInputObjectSchema } from './objects/PostTargetUncheckedUpdateInput.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';

export const PostTargetUpdateOneSchema: z.ZodType<Prisma.PostTargetUpdateArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), data: z.union([PostTargetUpdateInputObjectSchema, PostTargetUncheckedUpdateInputObjectSchema]), where: PostTargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PostTargetUpdateArgs>;

export const PostTargetUpdateOneZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), data: z.union([PostTargetUpdateInputObjectSchema, PostTargetUncheckedUpdateInputObjectSchema]), where: PostTargetWhereUniqueInputObjectSchema }).strict();