import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './objects/WatchSpecInclude.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './objects/WatchSpecWhereUniqueInput.schema';

export const WatchSpecFindUniqueOrThrowSchema: z.ZodType<Prisma.WatchSpecFindUniqueOrThrowArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), where: WatchSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchSpecFindUniqueOrThrowArgs>;

export const WatchSpecFindUniqueOrThrowZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), where: WatchSpecWhereUniqueInputObjectSchema }).strict();