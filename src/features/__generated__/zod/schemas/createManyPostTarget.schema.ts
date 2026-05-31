import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetCreateManyInputObjectSchema as PostTargetCreateManyInputObjectSchema } from './objects/PostTargetCreateManyInput.schema';

export const PostTargetCreateManySchema: z.ZodType<Prisma.PostTargetCreateManyArgs> = z.object({ data: z.union([ PostTargetCreateManyInputObjectSchema, z.array(PostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetCreateManyArgs>;

export const PostTargetCreateManyZodSchema = z.object({ data: z.union([ PostTargetCreateManyInputObjectSchema, z.array(PostTargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();