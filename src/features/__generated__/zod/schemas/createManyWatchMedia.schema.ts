import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaCreateManyInputObjectSchema as WatchMediaCreateManyInputObjectSchema } from './objects/WatchMediaCreateManyInput.schema';

export const WatchMediaCreateManySchema: z.ZodType<Prisma.WatchMediaCreateManyArgs> = z.object({ data: z.union([ WatchMediaCreateManyInputObjectSchema, z.array(WatchMediaCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaCreateManyArgs>;

export const WatchMediaCreateManyZodSchema = z.object({ data: z.union([ WatchMediaCreateManyInputObjectSchema, z.array(WatchMediaCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();