import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './objects/WatchSpecInclude.schema';
import { WatchSpecCreateInputObjectSchema as WatchSpecCreateInputObjectSchema } from './objects/WatchSpecCreateInput.schema';
import { WatchSpecUncheckedCreateInputObjectSchema as WatchSpecUncheckedCreateInputObjectSchema } from './objects/WatchSpecUncheckedCreateInput.schema';

export const WatchSpecCreateOneSchema: z.ZodType<Prisma.WatchSpecCreateArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), data: z.union([WatchSpecCreateInputObjectSchema, WatchSpecUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchSpecCreateArgs>;

export const WatchSpecCreateOneZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), data: z.union([WatchSpecCreateInputObjectSchema, WatchSpecUncheckedCreateInputObjectSchema]) }).strict();