import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectWhereUniqueInputObjectSchema as MediaObjectWhereUniqueInputObjectSchema } from './objects/MediaObjectWhereUniqueInput.schema';
import { MediaObjectCreateInputObjectSchema as MediaObjectCreateInputObjectSchema } from './objects/MediaObjectCreateInput.schema';
import { MediaObjectUncheckedCreateInputObjectSchema as MediaObjectUncheckedCreateInputObjectSchema } from './objects/MediaObjectUncheckedCreateInput.schema';
import { MediaObjectUpdateInputObjectSchema as MediaObjectUpdateInputObjectSchema } from './objects/MediaObjectUpdateInput.schema';
import { MediaObjectUncheckedUpdateInputObjectSchema as MediaObjectUncheckedUpdateInputObjectSchema } from './objects/MediaObjectUncheckedUpdateInput.schema';

export const MediaObjectUpsertOneSchema: z.ZodType<Prisma.MediaObjectUpsertArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema, create: z.union([ MediaObjectCreateInputObjectSchema, MediaObjectUncheckedCreateInputObjectSchema ]), update: z.union([ MediaObjectUpdateInputObjectSchema, MediaObjectUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MediaObjectUpsertArgs>;

export const MediaObjectUpsertOneZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), where: MediaObjectWhereUniqueInputObjectSchema, create: z.union([ MediaObjectCreateInputObjectSchema, MediaObjectUncheckedCreateInputObjectSchema ]), update: z.union([ MediaObjectUpdateInputObjectSchema, MediaObjectUncheckedUpdateInputObjectSchema ]) }).strict();