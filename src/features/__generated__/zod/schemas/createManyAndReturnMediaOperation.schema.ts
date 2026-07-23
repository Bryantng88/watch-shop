import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationCreateManyInputObjectSchema as MediaOperationCreateManyInputObjectSchema } from './objects/MediaOperationCreateManyInput.schema';

export const MediaOperationCreateManyAndReturnSchema: z.ZodType<Prisma.MediaOperationCreateManyAndReturnArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), data: z.union([ MediaOperationCreateManyInputObjectSchema, z.array(MediaOperationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MediaOperationCreateManyAndReturnArgs>;

export const MediaOperationCreateManyAndReturnZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), data: z.union([ MediaOperationCreateManyInputObjectSchema, z.array(MediaOperationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();