import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './objects/WatchSpecInclude.schema';
import { WatchSpecUpdateInputObjectSchema as WatchSpecUpdateInputObjectSchema } from './objects/WatchSpecUpdateInput.schema';
import { WatchSpecUncheckedUpdateInputObjectSchema as WatchSpecUncheckedUpdateInputObjectSchema } from './objects/WatchSpecUncheckedUpdateInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './objects/WatchSpecWhereUniqueInput.schema';

export const WatchSpecUpdateOneSchema: z.ZodType<Prisma.WatchSpecUpdateArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), data: z.union([WatchSpecUpdateInputObjectSchema, WatchSpecUncheckedUpdateInputObjectSchema]), where: WatchSpecWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchSpecUpdateArgs>;

export const WatchSpecUpdateOneZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), data: z.union([WatchSpecUpdateInputObjectSchema, WatchSpecUncheckedUpdateInputObjectSchema]), where: WatchSpecWhereUniqueInputObjectSchema }).strict();