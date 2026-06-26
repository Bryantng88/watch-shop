import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './objects/AppTagLinkInclude.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './objects/AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkCreateInputObjectSchema as AppTagLinkCreateInputObjectSchema } from './objects/AppTagLinkCreateInput.schema';
import { AppTagLinkUncheckedCreateInputObjectSchema as AppTagLinkUncheckedCreateInputObjectSchema } from './objects/AppTagLinkUncheckedCreateInput.schema';
import { AppTagLinkUpdateInputObjectSchema as AppTagLinkUpdateInputObjectSchema } from './objects/AppTagLinkUpdateInput.schema';
import { AppTagLinkUncheckedUpdateInputObjectSchema as AppTagLinkUncheckedUpdateInputObjectSchema } from './objects/AppTagLinkUncheckedUpdateInput.schema';

export const AppTagLinkUpsertOneSchema: z.ZodType<Prisma.AppTagLinkUpsertArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), where: AppTagLinkWhereUniqueInputObjectSchema, create: z.union([ AppTagLinkCreateInputObjectSchema, AppTagLinkUncheckedCreateInputObjectSchema ]), update: z.union([ AppTagLinkUpdateInputObjectSchema, AppTagLinkUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AppTagLinkUpsertArgs>;

export const AppTagLinkUpsertOneZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), where: AppTagLinkWhereUniqueInputObjectSchema, create: z.union([ AppTagLinkCreateInputObjectSchema, AppTagLinkUncheckedCreateInputObjectSchema ]), update: z.union([ AppTagLinkUpdateInputObjectSchema, AppTagLinkUncheckedUpdateInputObjectSchema ]) }).strict();