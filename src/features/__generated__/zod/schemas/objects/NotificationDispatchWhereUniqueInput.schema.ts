import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const NotificationDispatchWhereUniqueInputObjectSchema: z.ZodType<Prisma.NotificationDispatchWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchWhereUniqueInput>;
export const NotificationDispatchWhereUniqueInputObjectZodSchema = makeSchema();
