import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchUpdateManyMutationInputObjectSchema as WatchUpdateManyMutationInputObjectSchema } from './objects/WatchUpdateManyMutationInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';

export const WatchUpdateManySchema: z.ZodType<Prisma.WatchUpdateManyArgs> = z.object({ data: WatchUpdateManyMutationInputObjectSchema, where: WatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchUpdateManyArgs>;

export const WatchUpdateManyZodSchema = z.object({ data: WatchUpdateManyMutationInputObjectSchema, where: WatchWhereInputObjectSchema.optional() }).strict();