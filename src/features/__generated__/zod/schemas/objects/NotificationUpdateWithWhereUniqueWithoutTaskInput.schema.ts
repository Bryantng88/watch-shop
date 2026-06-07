import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationWhereUniqueInputObjectSchema as NotificationWhereUniqueInputObjectSchema } from './NotificationWhereUniqueInput.schema';
import { NotificationUpdateWithoutTaskInputObjectSchema as NotificationUpdateWithoutTaskInputObjectSchema } from './NotificationUpdateWithoutTaskInput.schema';
import { NotificationUncheckedUpdateWithoutTaskInputObjectSchema as NotificationUncheckedUpdateWithoutTaskInputObjectSchema } from './NotificationUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NotificationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => NotificationUpdateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const NotificationUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUpdateWithWhereUniqueWithoutTaskInput>;
export const NotificationUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
