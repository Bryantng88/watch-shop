import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';

export const WatchSpecV2FindUniqueSchema: z.ZodType<Prisma.WatchSpecV2FindUniqueArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2FindUniqueArgs>;

export const WatchSpecV2FindUniqueZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict();