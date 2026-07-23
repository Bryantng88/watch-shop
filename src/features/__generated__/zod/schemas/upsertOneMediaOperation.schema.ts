import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationWhereUniqueInputObjectSchema as MediaOperationWhereUniqueInputObjectSchema } from './objects/MediaOperationWhereUniqueInput.schema';
import { MediaOperationCreateInputObjectSchema as MediaOperationCreateInputObjectSchema } from './objects/MediaOperationCreateInput.schema';
import { MediaOperationUncheckedCreateInputObjectSchema as MediaOperationUncheckedCreateInputObjectSchema } from './objects/MediaOperationUncheckedCreateInput.schema';
import { MediaOperationUpdateInputObjectSchema as MediaOperationUpdateInputObjectSchema } from './objects/MediaOperationUpdateInput.schema';
import { MediaOperationUncheckedUpdateInputObjectSchema as MediaOperationUncheckedUpdateInputObjectSchema } from './objects/MediaOperationUncheckedUpdateInput.schema';

export const MediaOperationUpsertOneSchema: z.ZodType<Prisma.MediaOperationUpsertArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema, create: z.union([ MediaOperationCreateInputObjectSchema, MediaOperationUncheckedCreateInputObjectSchema ]), update: z.union([ MediaOperationUpdateInputObjectSchema, MediaOperationUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MediaOperationUpsertArgs>;

export const MediaOperationUpsertOneZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), where: MediaOperationWhereUniqueInputObjectSchema, create: z.union([ MediaOperationCreateInputObjectSchema, MediaOperationUncheckedCreateInputObjectSchema ]), update: z.union([ MediaOperationUpdateInputObjectSchema, MediaOperationUncheckedUpdateInputObjectSchema ]) }).strict();