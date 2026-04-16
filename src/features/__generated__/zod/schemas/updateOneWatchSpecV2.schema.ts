import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2UpdateInputObjectSchema as WatchSpecV2UpdateInputObjectSchema } from './objects/WatchSpecV2UpdateInput.schema';
import { WatchSpecV2UncheckedUpdateInputObjectSchema as WatchSpecV2UncheckedUpdateInputObjectSchema } from './objects/WatchSpecV2UncheckedUpdateInput.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';

export const WatchSpecV2UpdateOneSchema: z.ZodType<Prisma.WatchSpecV2UpdateArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), data: z.union([WatchSpecV2UpdateInputObjectSchema, WatchSpecV2UncheckedUpdateInputObjectSchema]), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateArgs>;

export const WatchSpecV2UpdateOneZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), data: z.union([WatchSpecV2UpdateInputObjectSchema, WatchSpecV2UncheckedUpdateInputObjectSchema]), where: WatchSpecV2WhereUniqueInputObjectSchema }).strict();