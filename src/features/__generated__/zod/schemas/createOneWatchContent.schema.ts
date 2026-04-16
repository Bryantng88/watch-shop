import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './objects/WatchContentInclude.schema';
import { WatchContentCreateInputObjectSchema as WatchContentCreateInputObjectSchema } from './objects/WatchContentCreateInput.schema';
import { WatchContentUncheckedCreateInputObjectSchema as WatchContentUncheckedCreateInputObjectSchema } from './objects/WatchContentUncheckedCreateInput.schema';

export const WatchContentCreateOneSchema: z.ZodType<Prisma.WatchContentCreateArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), data: z.union([WatchContentCreateInputObjectSchema, WatchContentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchContentCreateArgs>;

export const WatchContentCreateOneZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), data: z.union([WatchContentCreateInputObjectSchema, WatchContentUncheckedCreateInputObjectSchema]) }).strict();