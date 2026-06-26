import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './objects/AppTagLinkWhereInput.schema';

export const AppTagLinkDeleteManySchema: z.ZodType<Prisma.AppTagLinkDeleteManyArgs> = z.object({ where: AppTagLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkDeleteManyArgs>;

export const AppTagLinkDeleteManyZodSchema = z.object({ where: AppTagLinkWhereInputObjectSchema.optional() }).strict();