import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagSelectObjectSchema as AppTagSelectObjectSchema } from './objects/AppTagSelect.schema';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './objects/AppTagInclude.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';

export const AppTagFindUniqueOrThrowSchema: z.ZodType<Prisma.AppTagFindUniqueOrThrowArgs> = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), where: AppTagWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AppTagFindUniqueOrThrowArgs>;

export const AppTagFindUniqueOrThrowZodSchema = z.object({ select: AppTagSelectObjectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), where: AppTagWhereUniqueInputObjectSchema }).strict();