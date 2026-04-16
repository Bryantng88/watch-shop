import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecCreateManyInputObjectSchema as WatchSpecCreateManyInputObjectSchema } from './objects/WatchSpecCreateManyInput.schema';

export const WatchSpecCreateManySchema: z.ZodType<Prisma.WatchSpecCreateManyArgs> = z.object({ data: z.union([ WatchSpecCreateManyInputObjectSchema, z.array(WatchSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecCreateManyArgs>;

export const WatchSpecCreateManyZodSchema = z.object({ data: z.union([ WatchSpecCreateManyInputObjectSchema, z.array(WatchSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();