import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './objects/WatchContentWhereInput.schema';

export const WatchContentDeleteManySchema: z.ZodType<Prisma.WatchContentDeleteManyArgs> = z.object({ where: WatchContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentDeleteManyArgs>;

export const WatchContentDeleteManyZodSchema = z.object({ where: WatchContentWhereInputObjectSchema.optional() }).strict();