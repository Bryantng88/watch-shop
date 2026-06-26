import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagCreateManyInputObjectSchema as AppTagCreateManyInputObjectSchema } from './objects/AppTagCreateManyInput.schema';

export const AppTagCreateManyAndReturnSchema: z.ZodType<Prisma.AppTagCreateManyAndReturnArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), data: z.union([ AppTagCreateManyInputObjectSchema, z.array(AppTagCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AppTagCreateManyAndReturnArgs>;

export const AppTagCreateManyAndReturnZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), data: z.union([ AppTagCreateManyInputObjectSchema, z.array(AppTagCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();