import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './objects/AppTagInclude.schema';
import { AppTagCreateInputObjectSchema as AppTagCreateInputObjectSchema } from './objects/AppTagCreateInput.schema';
import { AppTagUncheckedCreateInputObjectSchema as AppTagUncheckedCreateInputObjectSchema } from './objects/AppTagUncheckedCreateInput.schema';

export const AppTagCreateOneSchema: z.ZodType<Prisma.AppTagCreateArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), data: z.union([AppTagCreateInputObjectSchema, AppTagUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AppTagCreateArgs>;

export const AppTagCreateOneZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), data: z.union([AppTagCreateInputObjectSchema, AppTagUncheckedCreateInputObjectSchema]) }).strict();