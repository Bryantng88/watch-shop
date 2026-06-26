import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './objects/AppTagLinkInclude.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './objects/AppTagLinkWhereUniqueInput.schema';

export const AppTagLinkDeleteOneSchema: z.ZodType<Prisma.AppTagLinkDeleteArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), where: AppTagLinkWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AppTagLinkDeleteArgs>;

export const AppTagLinkDeleteOneZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), where: AppTagLinkWhereUniqueInputObjectSchema }).strict();