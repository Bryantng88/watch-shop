import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';

export const WatchMediaDeleteOneSchema: z.ZodType<Prisma.WatchMediaDeleteArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchMediaDeleteArgs>;

export const WatchMediaDeleteOneZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema }).strict();