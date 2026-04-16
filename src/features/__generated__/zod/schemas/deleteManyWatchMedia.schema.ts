import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './objects/WatchMediaWhereInput.schema';

export const WatchMediaDeleteManySchema: z.ZodType<Prisma.WatchMediaDeleteManyArgs> = z.object({ where: WatchMediaWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaDeleteManyArgs>;

export const WatchMediaDeleteManyZodSchema = z.object({ where: WatchMediaWhereInputObjectSchema.optional() }).strict();