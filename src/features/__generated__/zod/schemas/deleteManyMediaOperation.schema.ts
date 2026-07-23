import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './objects/MediaOperationWhereInput.schema';

export const MediaOperationDeleteManySchema: z.ZodType<Prisma.MediaOperationDeleteManyArgs> = z.object({ where: MediaOperationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationDeleteManyArgs>;

export const MediaOperationDeleteManyZodSchema = z.object({ where: MediaOperationWhereInputObjectSchema.optional() }).strict();