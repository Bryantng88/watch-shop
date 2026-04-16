import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './objects/WatchInclude.schema';
import { WatchCreateInputObjectSchema as WatchCreateInputObjectSchema } from './objects/WatchCreateInput.schema';
import { WatchUncheckedCreateInputObjectSchema as WatchUncheckedCreateInputObjectSchema } from './objects/WatchUncheckedCreateInput.schema';

export const WatchCreateOneSchema: z.ZodType<Prisma.WatchCreateArgs> = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), data: z.union([WatchCreateInputObjectSchema, WatchUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchCreateArgs>;

export const WatchCreateOneZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), data: z.union([WatchCreateInputObjectSchema, WatchUncheckedCreateInputObjectSchema]) }).strict();