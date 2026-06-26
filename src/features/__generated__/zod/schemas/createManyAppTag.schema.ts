import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagCreateManyInputObjectSchema as AppTagCreateManyInputObjectSchema } from './objects/AppTagCreateManyInput.schema';

export const AppTagCreateManySchema: z.ZodType<Prisma.AppTagCreateManyArgs> = z.object({ data: z.union([ AppTagCreateManyInputObjectSchema, z.array(AppTagCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AppTagCreateManyArgs>;

export const AppTagCreateManyZodSchema = z.object({ data: z.union([ AppTagCreateManyInputObjectSchema, z.array(AppTagCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();