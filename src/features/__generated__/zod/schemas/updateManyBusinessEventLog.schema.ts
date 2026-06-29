import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogUpdateManyMutationInputObjectSchema as BusinessEventLogUpdateManyMutationInputObjectSchema } from './objects/BusinessEventLogUpdateManyMutationInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './objects/BusinessEventLogWhereInput.schema';

export const BusinessEventLogUpdateManySchema: z.ZodType<Prisma.BusinessEventLogUpdateManyArgs> = z.object({ data: BusinessEventLogUpdateManyMutationInputObjectSchema, where: BusinessEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateManyArgs>;

export const BusinessEventLogUpdateManyZodSchema = z.object({ data: BusinessEventLogUpdateManyMutationInputObjectSchema, where: BusinessEventLogWhereInputObjectSchema.optional() }).strict();