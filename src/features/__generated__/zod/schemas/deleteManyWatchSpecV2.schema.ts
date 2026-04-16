import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './objects/WatchSpecV2WhereInput.schema';

export const WatchSpecV2DeleteManySchema: z.ZodType<Prisma.WatchSpecV2DeleteManyArgs> = z.object({ where: WatchSpecV2WhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2DeleteManyArgs>;

export const WatchSpecV2DeleteManyZodSchema = z.object({ where: WatchSpecV2WhereInputObjectSchema.optional() }).strict();