import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  userId: z.string(),
  taskId: z.string(),
  type: z.string()
}).strict();
export const NotificationUserIdTaskIdTypeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.NotificationUserIdTaskIdTypeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUserIdTaskIdTypeCompoundUniqueInput>;
export const NotificationUserIdTaskIdTypeCompoundUniqueInputObjectZodSchema = makeSchema();
