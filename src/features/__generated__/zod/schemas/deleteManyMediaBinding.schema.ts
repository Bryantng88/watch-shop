import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './objects/MediaBindingWhereInput.schema';

export const MediaBindingDeleteManySchema: z.ZodType<Prisma.MediaBindingDeleteManyArgs> = z.object({ where: MediaBindingWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingDeleteManyArgs>;

export const MediaBindingDeleteManyZodSchema = z.object({ where: MediaBindingWhereInputObjectSchema.optional() }).strict();