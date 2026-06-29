import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './objects/BusinessEventLogWhereInput.schema';

export const BusinessEventLogDeleteManySchema: z.ZodType<Prisma.BusinessEventLogDeleteManyArgs> = z.object({ where: BusinessEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogDeleteManyArgs>;

export const BusinessEventLogDeleteManyZodSchema = z.object({ where: BusinessEventLogWhereInputObjectSchema.optional() }).strict();