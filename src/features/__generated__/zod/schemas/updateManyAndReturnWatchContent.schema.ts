import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentUpdateManyMutationInputObjectSchema as WatchContentUpdateManyMutationInputObjectSchema } from './objects/WatchContentUpdateManyMutationInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './objects/WatchContentWhereInput.schema';

export const WatchContentUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchContentUpdateManyAndReturnArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), data: WatchContentUpdateManyMutationInputObjectSchema, where: WatchContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentUpdateManyAndReturnArgs>;

export const WatchContentUpdateManyAndReturnZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), data: WatchContentUpdateManyMutationInputObjectSchema, where: WatchContentWhereInputObjectSchema.optional() }).strict();