import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './objects/MediaBindingInclude.schema';
import { MediaBindingCreateInputObjectSchema as MediaBindingCreateInputObjectSchema } from './objects/MediaBindingCreateInput.schema';
import { MediaBindingUncheckedCreateInputObjectSchema as MediaBindingUncheckedCreateInputObjectSchema } from './objects/MediaBindingUncheckedCreateInput.schema';

export const MediaBindingCreateOneSchema: z.ZodType<Prisma.MediaBindingCreateArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), data: z.union([MediaBindingCreateInputObjectSchema, MediaBindingUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MediaBindingCreateArgs>;

export const MediaBindingCreateOneZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), data: z.union([MediaBindingCreateInputObjectSchema, MediaBindingUncheckedCreateInputObjectSchema]) }).strict();