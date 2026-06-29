import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogUpdateManyMutationInputObjectSchema as BusinessEventLogUpdateManyMutationInputObjectSchema } from './objects/BusinessEventLogUpdateManyMutationInput.schema';
import { BusinessEventLogWhereInputObjectSchema as BusinessEventLogWhereInputObjectSchema } from './objects/BusinessEventLogWhereInput.schema';

export const BusinessEventLogUpdateManyAndReturnSchema: z.ZodType<Prisma.BusinessEventLogUpdateManyAndReturnArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), data: BusinessEventLogUpdateManyMutationInputObjectSchema, where: BusinessEventLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogUpdateManyAndReturnArgs>;

export const BusinessEventLogUpdateManyAndReturnZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), data: BusinessEventLogUpdateManyMutationInputObjectSchema, where: BusinessEventLogWhereInputObjectSchema.optional() }).strict();