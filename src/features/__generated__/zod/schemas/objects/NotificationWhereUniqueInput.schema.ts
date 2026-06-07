import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationUserIdTaskIdTypeCompoundUniqueInputObjectSchema as NotificationUserIdTaskIdTypeCompoundUniqueInputObjectSchema } from './NotificationUserIdTaskIdTypeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  userId_taskId_type: z.lazy(() => NotificationUserIdTaskIdTypeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const NotificationWhereUniqueInputObjectSchema: z.ZodType<Prisma.NotificationWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationWhereUniqueInput>;
export const NotificationWhereUniqueInputObjectZodSchema = makeSchema();
