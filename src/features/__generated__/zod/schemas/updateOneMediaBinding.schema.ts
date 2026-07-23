import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './objects/MediaBindingInclude.schema';
import { MediaBindingUpdateInputObjectSchema as MediaBindingUpdateInputObjectSchema } from './objects/MediaBindingUpdateInput.schema';
import { MediaBindingUncheckedUpdateInputObjectSchema as MediaBindingUncheckedUpdateInputObjectSchema } from './objects/MediaBindingUncheckedUpdateInput.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './objects/MediaBindingWhereUniqueInput.schema';

export const MediaBindingUpdateOneSchema: z.ZodType<Prisma.MediaBindingUpdateArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), data: z.union([MediaBindingUpdateInputObjectSchema, MediaBindingUncheckedUpdateInputObjectSchema]), where: MediaBindingWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaBindingUpdateArgs>;

export const MediaBindingUpdateOneZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), data: z.union([MediaBindingUpdateInputObjectSchema, MediaBindingUncheckedUpdateInputObjectSchema]), where: MediaBindingWhereUniqueInputObjectSchema }).strict();