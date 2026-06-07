import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationWhereUniqueInputObjectSchema as NotificationWhereUniqueInputObjectSchema } from './NotificationWhereUniqueInput.schema';
import { NotificationUpdateWithoutTaskInputObjectSchema as NotificationUpdateWithoutTaskInputObjectSchema } from './NotificationUpdateWithoutTaskInput.schema';
import { NotificationUncheckedUpdateWithoutTaskInputObjectSchema as NotificationUncheckedUpdateWithoutTaskInputObjectSchema } from './NotificationUncheckedUpdateWithoutTaskInput.schema';
import { NotificationCreateWithoutTaskInputObjectSchema as NotificationCreateWithoutTaskInputObjectSchema } from './NotificationCreateWithoutTaskInput.schema';
import { NotificationUncheckedCreateWithoutTaskInputObjectSchema as NotificationUncheckedCreateWithoutTaskInputObjectSchema } from './NotificationUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NotificationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => NotificationUpdateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const NotificationUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUpsertWithWhereUniqueWithoutTaskInput>;
export const NotificationUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
