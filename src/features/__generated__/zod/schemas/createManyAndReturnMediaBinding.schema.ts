import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingCreateManyInputObjectSchema as MediaBindingCreateManyInputObjectSchema } from './objects/MediaBindingCreateManyInput.schema';

export const MediaBindingCreateManyAndReturnSchema: z.ZodType<Prisma.MediaBindingCreateManyAndReturnArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), data: z.union([ MediaBindingCreateManyInputObjectSchema, z.array(MediaBindingCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingCreateManyAndReturnArgs>;

export const MediaBindingCreateManyAndReturnZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), data: z.union([ MediaBindingCreateManyInputObjectSchema, z.array(MediaBindingCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();