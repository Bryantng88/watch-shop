import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkUpdateManyMutationInputObjectSchema as AppTagLinkUpdateManyMutationInputObjectSchema } from './objects/AppTagLinkUpdateManyMutationInput.schema';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './objects/AppTagLinkWhereInput.schema';

export const AppTagLinkUpdateManySchema: z.ZodType<Prisma.AppTagLinkUpdateManyArgs> = z.object({ data: AppTagLinkUpdateManyMutationInputObjectSchema, where: AppTagLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkUpdateManyArgs>;

export const AppTagLinkUpdateManyZodSchema = z.object({ data: AppTagLinkUpdateManyMutationInputObjectSchema, where: AppTagLinkWhereInputObjectSchema.optional() }).strict();