import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaOperationSelectObjectSchema as MediaOperationSelectObjectSchema } from './objects/MediaOperationSelect.schema';
import { MediaOperationIncludeObjectSchema as MediaOperationIncludeObjectSchema } from './objects/MediaOperationInclude.schema';
import { MediaOperationCreateInputObjectSchema as MediaOperationCreateInputObjectSchema } from './objects/MediaOperationCreateInput.schema';
import { MediaOperationUncheckedCreateInputObjectSchema as MediaOperationUncheckedCreateInputObjectSchema } from './objects/MediaOperationUncheckedCreateInput.schema';

export const MediaOperationCreateOneSchema: z.ZodType<Prisma.MediaOperationCreateArgs> = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), data: z.union([MediaOperationCreateInputObjectSchema, MediaOperationUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MediaOperationCreateArgs>;

export const MediaOperationCreateOneZodSchema = z.object({ select: MediaOperationSelectObjectSchema.optional(), include: MediaOperationIncludeObjectSchema.optional(), data: z.union([MediaOperationCreateInputObjectSchema, MediaOperationUncheckedCreateInputObjectSchema]) }).strict();