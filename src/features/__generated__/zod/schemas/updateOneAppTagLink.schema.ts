import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './objects/AppTagLinkInclude.schema';
import { AppTagLinkUpdateInputObjectSchema as AppTagLinkUpdateInputObjectSchema } from './objects/AppTagLinkUpdateInput.schema';
import { AppTagLinkUncheckedUpdateInputObjectSchema as AppTagLinkUncheckedUpdateInputObjectSchema } from './objects/AppTagLinkUncheckedUpdateInput.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './objects/AppTagLinkWhereUniqueInput.schema';

export const AppTagLinkUpdateOneSchema: z.ZodType<Prisma.AppTagLinkUpdateArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), data: z.union([AppTagLinkUpdateInputObjectSchema, AppTagLinkUncheckedUpdateInputObjectSchema]), where: AppTagLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AppTagLinkUpdateArgs>;

export const AppTagLinkUpdateOneZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), data: z.union([AppTagLinkUpdateInputObjectSchema, AppTagLinkUncheckedUpdateInputObjectSchema]), where: AppTagLinkWhereUniqueInputObjectSchema }).strict();