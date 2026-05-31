import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetUpdateManyMutationInputObjectSchema as PostTargetUpdateManyMutationInputObjectSchema } from './objects/PostTargetUpdateManyMutationInput.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './objects/PostTargetWhereInput.schema';

export const PostTargetUpdateManySchema: z.ZodType<Prisma.PostTargetUpdateManyArgs> = z.object({ data: PostTargetUpdateManyMutationInputObjectSchema, where: PostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetUpdateManyArgs>;

export const PostTargetUpdateManyZodSchema = z.object({ data: PostTargetUpdateManyMutationInputObjectSchema, where: PostTargetWhereInputObjectSchema.optional() }).strict();