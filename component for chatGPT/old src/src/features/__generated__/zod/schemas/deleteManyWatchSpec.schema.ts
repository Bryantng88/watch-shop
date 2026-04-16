import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './objects/WatchSpecWhereInput.schema';

export const WatchSpecDeleteManySchema: z.ZodType<Prisma.WatchSpecDeleteManyArgs> = z.object({ where: WatchSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecDeleteManyArgs>;

export const WatchSpecDeleteManyZodSchema = z.object({ where: WatchSpecWhereInputObjectSchema.optional() }).strict();