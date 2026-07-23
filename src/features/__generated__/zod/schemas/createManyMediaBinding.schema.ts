import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingCreateManyInputObjectSchema as MediaBindingCreateManyInputObjectSchema } from './objects/MediaBindingCreateManyInput.schema';

export const MediaBindingCreateManySchema: z.ZodType<Prisma.MediaBindingCreateManyArgs> = z.object({ data: z.union([ MediaBindingCreateManyInputObjectSchema, z.array(MediaBindingCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingCreateManyArgs>;

export const MediaBindingCreateManyZodSchema = z.object({ data: z.union([ MediaBindingCreateManyInputObjectSchema, z.array(MediaBindingCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();