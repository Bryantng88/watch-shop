import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './objects/AppTagInclude.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';
import { AppTagCreateInputObjectSchema as AppTagCreateInputObjectSchema } from './objects/AppTagCreateInput.schema';
import { AppTagUncheckedCreateInputObjectSchema as AppTagUncheckedCreateInputObjectSchema } from './objects/AppTagUncheckedCreateInput.schema';
import { AppTagUpdateInputObjectSchema as AppTagUpdateInputObjectSchema } from './objects/AppTagUpdateInput.schema';
import { AppTagUncheckedUpdateInputObjectSchema as AppTagUncheckedUpdateInputObjectSchema } from './objects/AppTagUncheckedUpdateInput.schema';

export const AppTagUpsertOneSchema: z.ZodType<Prisma.AppTagUpsertArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), where: AppTagWhereUniqueInputObjectSchema, create: z.union([ AppTagCreateInputObjectSchema, AppTagUncheckedCreateInputObjectSchema ]), update: z.union([ AppTagUpdateInputObjectSchema, AppTagUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AppTagUpsertArgs>;

export const AppTagUpsertOneZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), where: AppTagWhereUniqueInputObjectSchema, create: z.union([ AppTagCreateInputObjectSchema, AppTagUncheckedCreateInputObjectSchema ]), update: z.union([ AppTagUpdateInputObjectSchema, AppTagUncheckedUpdateInputObjectSchema ]) }).strict();