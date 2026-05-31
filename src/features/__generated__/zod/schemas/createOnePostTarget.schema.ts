import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetCreateInputObjectSchema as PostTargetCreateInputObjectSchema } from './objects/PostTargetCreateInput.schema';
import { PostTargetUncheckedCreateInputObjectSchema as PostTargetUncheckedCreateInputObjectSchema } from './objects/PostTargetUncheckedCreateInput.schema';

export const PostTargetCreateOneSchema: z.ZodType<Prisma.PostTargetCreateArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), data: z.union([PostTargetCreateInputObjectSchema, PostTargetUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PostTargetCreateArgs>;

export const PostTargetCreateOneZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), data: z.union([PostTargetCreateInputObjectSchema, PostTargetUncheckedCreateInputObjectSchema]) }).strict();