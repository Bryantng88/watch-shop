import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkCreateManyInputObjectSchema as AppTagLinkCreateManyInputObjectSchema } from './objects/AppTagLinkCreateManyInput.schema';

export const AppTagLinkCreateManyAndReturnSchema: z.ZodType<Prisma.AppTagLinkCreateManyAndReturnArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), data: z.union([ AppTagLinkCreateManyInputObjectSchema, z.array(AppTagLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkCreateManyAndReturnArgs>;

export const AppTagLinkCreateManyAndReturnZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), data: z.union([ AppTagLinkCreateManyInputObjectSchema, z.array(AppTagLinkCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();