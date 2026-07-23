import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaBindingSelectObjectSchema as MediaBindingSelectObjectSchema } from './objects/MediaBindingSelect.schema';
import { MediaBindingUpdateManyMutationInputObjectSchema as MediaBindingUpdateManyMutationInputObjectSchema } from './objects/MediaBindingUpdateManyMutationInput.schema';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './objects/MediaBindingWhereInput.schema';

export const MediaBindingUpdateManyAndReturnSchema: z.ZodType<Prisma.MediaBindingUpdateManyAndReturnArgs> = z.object({ select: MediaBindingSelectObjectSchema.optional(), data: MediaBindingUpdateManyMutationInputObjectSchema, where: MediaBindingWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaBindingUpdateManyAndReturnArgs>;

export const MediaBindingUpdateManyAndReturnZodSchema = z.object({ select: MediaBindingSelectObjectSchema.optional(), data: MediaBindingUpdateManyMutationInputObjectSchema, where: MediaBindingWhereInputObjectSchema.optional() }).strict();