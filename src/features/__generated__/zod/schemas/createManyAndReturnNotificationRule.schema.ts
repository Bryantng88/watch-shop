import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './objects/NotificationRuleSelect.schema';
import { NotificationRuleCreateManyInputObjectSchema as NotificationRuleCreateManyInputObjectSchema } from './objects/NotificationRuleCreateManyInput.schema';

export const NotificationRuleCreateManyAndReturnSchema: z.ZodType<Prisma.NotificationRuleCreateManyAndReturnArgs> = z.object({ select: NotificationRuleSelectObjectSchema.optional(), data: z.union([ NotificationRuleCreateManyInputObjectSchema, z.array(NotificationRuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.NotificationRuleCreateManyAndReturnArgs>;

export const NotificationRuleCreateManyAndReturnZodSchema = z.object({ select: NotificationRuleSelectObjectSchema.optional(), data: z.union([ NotificationRuleCreateManyInputObjectSchema, z.array(NotificationRuleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();