import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchUpdateManyMutationInputObjectSchema as WatchUpdateManyMutationInputObjectSchema } from './objects/WatchUpdateManyMutationInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';

export const WatchUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchUpdateManyAndReturnArgs> = z.object({ select: WatchSelectObjectSchema.optional(), data: WatchUpdateManyMutationInputObjectSchema, where: WatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchUpdateManyAndReturnArgs>;

export const WatchUpdateManyAndReturnZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), data: WatchUpdateManyMutationInputObjectSchema, where: WatchWhereInputObjectSchema.optional() }).strict();