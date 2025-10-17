import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecUpdateManyMutationInputObjectSchema as WatchSpecUpdateManyMutationInputObjectSchema } from './objects/WatchSpecUpdateManyMutationInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './objects/WatchSpecWhereInput.schema';

export const WatchSpecUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchSpecUpdateManyAndReturnArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), data: WatchSpecUpdateManyMutationInputObjectSchema, where: WatchSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecUpdateManyAndReturnArgs>;

export const WatchSpecUpdateManyAndReturnZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), data: WatchSpecUpdateManyMutationInputObjectSchema, where: WatchSpecWhereInputObjectSchema.optional() }).strict();