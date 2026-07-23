import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationUpdateManyMutationInputObjectSchema as MediaOperationUpdateManyMutationInputObjectSchema } from './objects/MediaOperationUpdateManyMutationInput.schema';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './objects/MediaOperationWhereInput.schema';

export const MediaOperationUpdateManyAndReturnSchema: z.ZodType<Prisma.MediaOperationUpdateManyAndReturnArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), data: MediaOperationUpdateManyMutationInputObjectSchema, where: MediaOperationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationUpdateManyAndReturnArgs>;

export const MediaOperationUpdateManyAndReturnZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), data: MediaOperationUpdateManyMutationInputObjectSchema, where: MediaOperationWhereInputObjectSchema.optional() }).strict();