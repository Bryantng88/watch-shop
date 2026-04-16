import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';

export const WatchDeleteManySchema: z.ZodType<Prisma.WatchDeleteManyArgs> = z.object({ where: WatchWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchDeleteManyArgs>;

export const WatchDeleteManyZodSchema = z.object({ where: WatchWhereInputObjectSchema.optional() }).strict();