import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingIncludeObjectSchema as MediaBindingIncludeObjectSchema } from './objects/MediaBindingInclude.schema';
import { MediaBindingWhereUniqueInputObjectSchema as MediaBindingWhereUniqueInputObjectSchema } from './objects/MediaBindingWhereUniqueInput.schema';

export const MediaBindingDeleteOneSchema: z.ZodType<Prisma.MediaBindingDeleteArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), where: MediaBindingWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaBindingDeleteArgs>;

export const MediaBindingDeleteOneZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), include: MediaBindingIncludeObjectSchema.optional(), where: MediaBindingWhereUniqueInputObjectSchema }).strict();