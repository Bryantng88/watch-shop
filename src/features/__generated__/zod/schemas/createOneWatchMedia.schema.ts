import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaCreateInputObjectSchema as WatchMediaCreateInputObjectSchema } from './objects/WatchMediaCreateInput.schema';
import { WatchMediaUncheckedCreateInputObjectSchema as WatchMediaUncheckedCreateInputObjectSchema } from './objects/WatchMediaUncheckedCreateInput.schema';

export const WatchMediaCreateOneSchema: z.ZodType<Prisma.WatchMediaCreateArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), data: z.union([WatchMediaCreateInputObjectSchema, WatchMediaUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchMediaCreateArgs>;

export const WatchMediaCreateOneZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), data: z.union([WatchMediaCreateInputObjectSchema, WatchMediaUncheckedCreateInputObjectSchema]) }).strict();