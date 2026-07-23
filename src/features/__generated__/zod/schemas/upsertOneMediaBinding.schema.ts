import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './objects/MediaBindingInclude.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './objects/MediaBindingWhereUniqueInput.schema';
import { MediaBindingCreateInputObjectSchema as MediaBindingCreateInputObjectSchema } from './objects/MediaBindingCreateInput.schema';
import { MediaBindingUncheckedCreateInputObjectSchema as MediaBindingUncheckedCreateInputObjectSchema } from './objects/MediaBindingUncheckedCreateInput.schema';
import { MediaBindingUpdateInputObjectSchema as MediaBindingUpdateInputObjectSchema } from './objects/MediaBindingUpdateInput.schema';
import { MediaBindingUncheckedUpdateInputObjectSchema as MediaBindingUncheckedUpdateInputObjectSchema } from './objects/MediaBindingUncheckedUpdateInput.schema';

export const MediaBindingUpsertOneSchema: z.ZodType<Prisma.MediaBindingUpsertArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), where: MediaBindingWhereUniqueInputObjectSchema, create: z.union([ MediaBindingCreateInputObjectSchema, MediaBindingUncheckedCreateInputObjectSchema ]), update: z.union([ MediaBindingUpdateInputObjectSchema, MediaBindingUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MediaBindingUpsertArgs>;

export const MediaBindingUpsertOneZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), where: MediaBindingWhereUniqueInputObjectSchema, create: z.union([ MediaBindingCreateInputObjectSchema, MediaBindingUncheckedCreateInputObjectSchema ]), update: z.union([ MediaBindingUpdateInputObjectSchema, MediaBindingUncheckedUpdateInputObjectSchema ]) }).strict();