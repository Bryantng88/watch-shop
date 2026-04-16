import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentCreateManyInputObjectSchema as WatchContentCreateManyInputObjectSchema } from './objects/WatchContentCreateManyInput.schema';

export const WatchContentCreateManySchema: z.ZodType<Prisma.WatchContentCreateManyArgs> = z.object({ data: z.union([ WatchContentCreateManyInputObjectSchema, z.array(WatchContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentCreateManyArgs>;

export const WatchContentCreateManyZodSchema = z.object({ data: z.union([ WatchContentCreateManyInputObjectSchema, z.array(WatchContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();