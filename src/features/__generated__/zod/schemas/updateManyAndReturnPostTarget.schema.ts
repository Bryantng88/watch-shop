import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetSelectObjectSchema as PostTargetSelectObjectSchema } from './objects/PostTargetSelect.schema';
import { PostTargetUpdateManyMutationInputObjectSchema as PostTargetUpdateManyMutationInputObjectSchema } from './objects/PostTargetUpdateManyMutationInput.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './objects/PostTargetWhereInput.schema';

export const PostTargetUpdateManyAndReturnSchema: z.ZodType<Prisma.PostTargetUpdateManyAndReturnArgs> = z.object({ select: PostTargetSelectObjectSchema.optional(), data: PostTargetUpdateManyMutationInputObjectSchema, where: PostTargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetUpdateManyAndReturnArgs>;

export const PostTargetUpdateManyAndReturnZodSchema = z.object({ select: PostTargetSelectObjectSchema.optional(), data: PostTargetUpdateManyMutationInputObjectSchema, where: PostTargetWhereInputObjectSchema.optional() }).strict();