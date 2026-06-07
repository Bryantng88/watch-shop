import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationScalarWhereInputObjectSchema as NotificationScalarWhereInputObjectSchema } from './NotificationScalarWhereInput.schema';
import { NotificationUpdateManyMutationInputObjectSchema as NotificationUpdateManyMutationInputObjectSchema } from './NotificationUpdateManyMutationInput.schema';
import { NotificationUncheckedUpdateManyWithoutTaskInputObjectSchema as NotificationUncheckedUpdateManyWithoutTaskInputObjectSchema } from './NotificationUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NotificationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => NotificationUpdateManyMutationInputObjectSchema), z.lazy(() => NotificationUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const NotificationUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUpdateManyWithWhereWithoutTaskInput>;
export const NotificationUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
