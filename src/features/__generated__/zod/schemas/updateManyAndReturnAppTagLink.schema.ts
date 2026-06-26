import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkSelectObjectSchema as AppTagLinkSelectObjectSchema } from './objects/AppTagLinkSelect.schema';
import { AppTagLinkUpdateManyMutationInputObjectSchema as AppTagLinkUpdateManyMutationInputObjectSchema } from './objects/AppTagLinkUpdateManyMutationInput.schema';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './objects/AppTagLinkWhereInput.schema';

export const AppTagLinkUpdateManyAndReturnSchema: z.ZodType<Prisma.AppTagLinkUpdateManyAndReturnArgs> = z.object({ select: AppTagLinkSelectObjectSchema.optional(), data: AppTagLinkUpdateManyMutationInputObjectSchema, where: AppTagLinkWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkUpdateManyAndReturnArgs>;

export const AppTagLinkUpdateManyAndReturnZodSchema = z.object({ select: AppTagLinkSelectObjectSchema.optional(), data: AppTagLinkUpdateManyMutationInputObjectSchema, where: AppTagLinkWhereInputObjectSchema.optional() }).strict();