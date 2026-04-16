import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaUpdateManyMutationInputObjectSchema as WatchMediaUpdateManyMutationInputObjectSchema } from './objects/WatchMediaUpdateManyMutationInput.schema';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './objects/WatchMediaWhereInput.schema';

export const WatchMediaUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchMediaUpdateManyAndReturnArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), data: WatchMediaUpdateManyMutationInputObjectSchema, where: WatchMediaWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaUpdateManyAndReturnArgs>;

export const WatchMediaUpdateManyAndReturnZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), data: WatchMediaUpdateManyMutationInputObjectSchema, where: WatchMediaWhereInputObjectSchema.optional() }).strict();