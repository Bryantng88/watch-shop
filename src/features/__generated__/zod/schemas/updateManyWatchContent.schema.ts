import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentUpdateManyMutationInputObjectSchema as WatchContentUpdateManyMutationInputObjectSchema } from './objects/WatchContentUpdateManyMutationInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './objects/WatchContentWhereInput.schema';

export const WatchContentUpdateManySchema: z.ZodType<Prisma.WatchContentUpdateManyArgs> = z.object({ data: WatchContentUpdateManyMutationInputObjectSchema, where: WatchContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentUpdateManyArgs>;

export const WatchContentUpdateManyZodSchema = z.object({ data: WatchContentUpdateManyMutationInputObjectSchema, where: WatchContentWhereInputObjectSchema.optional() }).strict();