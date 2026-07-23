import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationUpdateManyMutationInputObjectSchema as MediaOperationUpdateManyMutationInputObjectSchema } from './objects/MediaOperationUpdateManyMutationInput.schema';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './objects/MediaOperationWhereInput.schema';

export const MediaOperationUpdateManySchema: z.ZodType<Prisma.MediaOperationUpdateManyArgs> = z.object({ data: MediaOperationUpdateManyMutationInputObjectSchema, where: MediaOperationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationUpdateManyArgs>;

export const MediaOperationUpdateManyZodSchema = z.object({ data: MediaOperationUpdateManyMutationInputObjectSchema, where: MediaOperationWhereInputObjectSchema.optional() }).strict();