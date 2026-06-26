import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagUpdateManyMutationInputObjectSchema as AppTagUpdateManyMutationInputObjectSchema } from './objects/AppTagUpdateManyMutationInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';

export const AppTagUpdateManySchema: z.ZodType<Prisma.AppTagUpdateManyArgs> = z.object({ data: AppTagUpdateManyMutationInputObjectSchema, where: AppTagWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagUpdateManyArgs>;

export const AppTagUpdateManyZodSchema = z.object({ data: AppTagUpdateManyMutationInputObjectSchema, where: AppTagWhereInputObjectSchema.optional() }).strict();