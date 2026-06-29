import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  key: z.string().optional()
}).strict();
export const NotificationRecipientGroupWhereUniqueInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupWhereUniqueInput>;
export const NotificationRecipientGroupWhereUniqueInputObjectZodSchema = makeSchema();
