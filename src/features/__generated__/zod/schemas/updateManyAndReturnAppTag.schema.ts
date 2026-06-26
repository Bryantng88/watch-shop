import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagUpdateManyMutationInputObjectSchema as AppTagUpdateManyMutationInputObjectSchema } from './objects/AppTagUpdateManyMutationInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';

export const AppTagUpdateManyAndReturnSchema: z.ZodType<Prisma.AppTagUpdateManyAndReturnArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), data: AppTagUpdateManyMutationInputObjectSchema, where: AppTagWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagUpdateManyAndReturnArgs>;

export const AppTagUpdateManyAndReturnZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), data: AppTagUpdateManyMutationInputObjectSchema, where: AppTagWhereInputObjectSchema.optional() }).strict();