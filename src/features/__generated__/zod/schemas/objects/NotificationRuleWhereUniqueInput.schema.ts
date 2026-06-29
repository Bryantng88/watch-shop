import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const NotificationRuleWhereUniqueInputObjectSchema: z.ZodType<Prisma.NotificationRuleWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleWhereUniqueInput>;
export const NotificationRuleWhereUniqueInputObjectZodSchema = makeSchema();
