import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaObjectSelectObjectSchema as MediaObjectSelectObjectSchema } from './objects/MediaObjectSelect.schema';
import { MediaObjectIncludeObjectSchema as MediaObjectIncludeObjectSchema } from './objects/MediaObjectInclude.schema';
import { MediaObjectCreateInputObjectSchema as MediaObjectCreateInputObjectSchema } from './objects/MediaObjectCreateInput.schema';
import { MediaObjectUncheckedCreateInputObjectSchema as MediaObjectUncheckedCreateInputObjectSchema } from './objects/MediaObjectUncheckedCreateInput.schema';

export const MediaObjectCreateOneSchema: z.ZodType<Prisma.MediaObjectCreateArgs> = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), data: z.union([MediaObjectCreateInputObjectSchema, MediaObjectUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MediaObjectCreateArgs>;

export const MediaObjectCreateOneZodSchema = z.object({ select: MediaObjectSelectObjectSchema.optional(), include: MediaObjectIncludeObjectSchema.optional(), data: z.union([MediaObjectCreateInputObjectSchema, MediaObjectUncheckedCreateInputObjectSchema]) }).strict();