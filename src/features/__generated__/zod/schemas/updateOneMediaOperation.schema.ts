import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationUpdateInputObjectSchema as MediaOperationUpdateInputObjectSchema } from './objects/MediaOperationUpdateInput.schema';
import { MediaOperationUncheckedUpdateInputObjectSchema as MediaOperationUncheckedUpdateInputObjectSchema } from './objects/MediaOperationUncheckedUpdateInput.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';

export const MediaOperationUpdateOneSchema: z.ZodType<Prisma.MediaOperationUpdateArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), data: z.union([MediaOperationUpdateInputObjectSchema, MediaOperationUncheckedUpdateInputObjectSchema]), where: MediaOperationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MediaOperationUpdateArgs>;

export const MediaOperationUpdateOneZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), data: z.union([MediaOperationUpdateInputObjectSchema, MediaOperationUncheckedUpdateInputObjectSchema]), where: MediaOperationWhereUniqueInputObjectSchema }).strict();