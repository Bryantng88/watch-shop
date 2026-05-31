import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetCreateManyInputObjectSchema as PostTargetCreateManyInputObjectSchema } from './objects/PostTargetCreateManyInput.schema';

export const PostTargetCreateManyAndReturnSchema: z.ZodType<Prisma.PostTargetCreateManyAndReturnArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), data: z.union([ PostTargetCreateManyInputObjectSchema, z.array(PostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetCreateManyAndReturnArgs>;

export const PostTargetCreateManyAndReturnZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), data: z.union([ PostTargetCreateManyInputObjectSchema, z.array(PostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();