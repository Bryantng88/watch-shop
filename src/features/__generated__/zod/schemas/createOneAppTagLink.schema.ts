import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './objects/AppTagLinkInclude.schema';
import { AppTagLinkCreateInputObjectSchema as AppTagLinkCreateInputObjectSchema } from './objects/AppTagLinkCreateInput.schema';
import { AppTagLinkUncheckedCreateInputObjectSchema as AppTagLinkUncheckedCreateInputObjectSchema } from './objects/AppTagLinkUncheckedCreateInput.schema';

export const AppTagLinkCreateOneSchema: z.ZodType<Prisma.AppTagLinkCreateArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), data: z.union([AppTagLinkCreateInputObjectSchema, AppTagLinkUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AppTagLinkCreateArgs>;

export const AppTagLinkCreateOneZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), data: z.union([AppTagLinkCreateInputObjectSchema, AppTagLinkUncheckedCreateInputObjectSchema]) }).strict();