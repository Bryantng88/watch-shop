import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './objects/WatchInclude.schema';
import { WatchUpdateInputObjectSchema as WatchUpdateInputObjectSchema } from './objects/WatchUpdateInput.schema';
import { WatchUncheckedUpdateInputObjectSchema as WatchUncheckedUpdateInputObjectSchema } from './objects/WatchUncheckedUpdateInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';

export const WatchUpdateOneSchema: z.ZodType<Prisma.WatchUpdateArgs> = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), data: z.union([WatchUpdateInputObjectSchema, WatchUncheckedUpdateInputObjectSchema]), where: WatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchUpdateArgs>;

export const WatchUpdateOneZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), data: z.union([WatchUpdateInputObjectSchema, WatchUncheckedUpdateInputObjectSchema]), where: WatchWhereUniqueInputObjectSchema }).strict();