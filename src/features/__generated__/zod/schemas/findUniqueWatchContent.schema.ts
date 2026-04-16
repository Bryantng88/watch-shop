import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './objects/WatchContentInclude.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './objects/WatchContentWhereUniqueInput.schema';

export const WatchContentFindUniqueSchema: z.ZodType<Prisma.WatchContentFindUniqueArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), where: WatchContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchContentFindUniqueArgs>;

export const WatchContentFindUniqueZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), where: WatchContentWhereUniqueInputObjectSchema }).strict();