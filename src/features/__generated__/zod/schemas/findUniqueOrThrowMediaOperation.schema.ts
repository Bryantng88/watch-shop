import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';

export const MediaOperationFindUniqueOrThrowSchema: z.ZodType<Prisma.MediaOperationFindUniqueOrThrowArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaOperationFindUniqueOrThrowArgs>;

export const MediaOperationFindUniqueOrThrowZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema }).strict();