import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';

export const WatchMediaFindUniqueOrThrowSchema: z.ZodType<Prisma.WatchMediaFindUniqueOrThrowArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchMediaFindUniqueOrThrowArgs>;

export const WatchMediaFindUniqueOrThrowZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema }).strict();