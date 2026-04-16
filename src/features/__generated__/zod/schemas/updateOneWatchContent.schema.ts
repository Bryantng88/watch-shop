import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './objects/WatchContentInclude.schema';
import { WatchContentUpdateInputObjectSchema as WatchContentUpdateInputObjectSchema } from './objects/WatchContentUpdateInput.schema';
import { WatchContentUncheckedUpdateInputObjectSchema as WatchContentUncheckedUpdateInputObjectSchema } from './objects/WatchContentUncheckedUpdateInput.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './objects/WatchContentWhereUniqueInput.schema';

export const WatchContentUpdateOneSchema: z.ZodType<Prisma.WatchContentUpdateArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), data: z.union([WatchContentUpdateInputObjectSchema, WatchContentUncheckedUpdateInputObjectSchema]), where: WatchContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchContentUpdateArgs>;

export const WatchContentUpdateOneZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), data: z.union([WatchContentUpdateInputObjectSchema, WatchContentUncheckedUpdateInputObjectSchema]), where: WatchContentWhereUniqueInputObjectSchema }).strict();