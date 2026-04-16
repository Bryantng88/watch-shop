import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';

export const WatchSpecV2FindUniqueOrThrowSchema: z.ZodType<Prisma.WatchSpecV2FindUniqueOrThrowArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2FindUniqueOrThrowArgs>;

export const WatchSpecV2FindUniqueOrThrowZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict();