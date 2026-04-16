import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaUpdateInputObjectSchema as WatchMediaUpdateInputObjectSchema } from './objects/WatchMediaUpdateInput.schema';
import { WatchMediaUncheckedUpdateInputObjectSchema as WatchMediaUncheckedUpdateInputObjectSchema } from './objects/WatchMediaUncheckedUpdateInput.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';

export const WatchMediaUpdateOneSchema: z.ZodType<Prisma.WatchMediaUpdateArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), data: z.union([WatchMediaUpdateInputObjectSchema, WatchMediaUncheckedUpdateInputObjectSchema]), where: WatchMediaWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchMediaUpdateArgs>;

export const WatchMediaUpdateOneZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), data: z.union([WatchMediaUpdateInputObjectSchema, WatchMediaUncheckedUpdateInputObjectSchema]), where: WatchMediaWhereUniqueInputObjectSchema }).strict();