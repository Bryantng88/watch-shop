import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './objects/WatchInclude.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';

export const WatchDeleteOneSchema: z.ZodType<Prisma.WatchDeleteArgs> = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), where: WatchWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchDeleteArgs>;

export const WatchDeleteOneZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), where: WatchWhereUniqueInputObjectSchema }).strict();