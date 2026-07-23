import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingUpdateManyMutationInputObjectSchema as MediaBindingUpdateManyMutationInputObjectSchema } from './objects/MediaBindingUpdateManyMutationInput.schema';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './objects/MediaBindingWhereInput.schema';

export const MediaBindingUpdateManySchema: z.ZodType<Prisma.MediaBindingUpdateManyArgs> = z.object({ data: MediaBindingUpdateManyMutationInputObjectSchema, where: MediaBindingWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingUpdateManyArgs>;

export const MediaBindingUpdateManyZodSchema = z.object({ data: MediaBindingUpdateManyMutationInputObjectSchema, where: MediaBindingWhereInputObjectSchema.optional() }).strict();