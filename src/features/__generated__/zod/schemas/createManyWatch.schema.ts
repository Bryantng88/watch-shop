import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchCreateManyInputObjectSchema as WatchCreateManyInputObjectSchema } from './objects/WatchCreateManyInput.schema';

export const WatchCreateManySchema: z.ZodType<Prisma.WatchCreateManyArgs> = z.object({ data: z.union([ WatchCreateManyInputObjectSchema, z.array(WatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchCreateManyArgs>;

export const WatchCreateManyZodSchema = z.object({ data: z.union([ WatchCreateManyInputObjectSchema, z.array(WatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();