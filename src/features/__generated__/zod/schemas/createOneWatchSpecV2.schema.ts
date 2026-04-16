import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2CreateInputObjectSchema as WatchSpecV2CreateInputObjectSchema } from './objects/WatchSpecV2CreateInput.schema';
import { WatchSpecV2UncheckedCreateInputObjectSchema as WatchSpecV2UncheckedCreateInputObjectSchema } from './objects/WatchSpecV2UncheckedCreateInput.schema';

export const WatchSpecV2CreateOneSchema: z.ZodType<Prisma.WatchSpecV2CreateArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), data: z.union([WatchSpecV2CreateInputObjectSchema, WatchSpecV2UncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2CreateArgs>;

export const WatchSpecV2CreateOneZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), data: z.union([WatchSpecV2CreateInputObjectSchema, WatchSpecV2UncheckedCreateInputObjectSchema]) }).strict();