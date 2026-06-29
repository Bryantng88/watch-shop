import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BusinessEventLogSelectObjectSchema as BusinessEventLogSelectObjectSchema } from './objects/BusinessEventLogSelect.schema';
import { BusinessEventLogIncludeObjectSchema as BusinessEventLogIncludeObjectSchema } from './objects/BusinessEventLogInclude.schema';
import { BusinessEventLogWhereUniqueInputObjectSchema as BusinessEventLogWhereUniqueInputObjectSchema } from './objects/BusinessEventLogWhereUniqueInput.schema';

export const BusinessEventLogFindUniqueOrThrowSchema: z.ZodType<Prisma.BusinessEventLogFindUniqueOrThrowArgs> = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), where: BusinessEventLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BusinessEventLogFindUniqueOrThrowArgs>;

export const BusinessEventLogFindUniqueOrThrowZodSchema = z.object({ select: BusinessEventLogSelectObjectSchema.optional(), include: BusinessEventLogIncludeObjectSchema.optional(), where: BusinessEventLogWhereUniqueInputObjectSchema }).strict();