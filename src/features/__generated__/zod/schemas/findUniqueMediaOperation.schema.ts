import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';

export const MediaOperationFindUniqueSchema: z.ZodType<Prisma.MediaOperationFindUniqueArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaOperationFindUniqueArgs>;

export const MediaOperationFindUniqueZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema }).strict();