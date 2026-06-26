import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkCreateManyInputObjectSchema as AppTagLinkCreateManyInputObjectSchema } from './objects/AppTagLinkCreateManyInput.schema';

export const AppTagLinkCreateManySchema: z.ZodType<Prisma.AppTagLinkCreateManyArgs> = z.object({ data: z.union([ AppTagLinkCreateManyInputObjectSchema, z.array(AppTagLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkCreateManyArgs>;

export const AppTagLinkCreateManyZodSchema = z.object({ data: z.union([ AppTagLinkCreateManyInputObjectSchema, z.array(AppTagLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();