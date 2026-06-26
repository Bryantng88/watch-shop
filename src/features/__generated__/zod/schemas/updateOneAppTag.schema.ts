import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './objects/AppTagInclude.schema';
import { AppTagUpdateInputObjectSchema as AppTagUpdateInputObjectSchema } from './objects/AppTagUpdateInput.schema';
import { AppTagUncheckedUpdateInputObjectSchema as AppTagUncheckedUpdateInputObjectSchema } from './objects/AppTagUncheckedUpdateInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';

export const AppTagUpdateOneSchema: z.ZodType<Prisma.AppTagUpdateArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), data: z.union([AppTagUpdateInputObjectSchema, AppTagUncheckedUpdateInputObjectSchema]), where: AppTagWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AppTagUpdateArgs>;

export const AppTagUpdateOneZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), data: z.union([AppTagUpdateInputObjectSchema, AppTagUncheckedUpdateInputObjectSchema]), where: AppTagWhereUniqueInputObjectSchema }).strict();