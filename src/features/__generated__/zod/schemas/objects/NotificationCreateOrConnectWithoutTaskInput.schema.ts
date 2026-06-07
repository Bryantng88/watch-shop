import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationWhereUniqueInputObjectSchema as NotificationWhereUniqueInputObjectSchema } from './NotificationWhereUniqueInput.schema';
import { NotificationCreateWithoutTaskInputObjectSchema as NotificationCreateWithoutTaskInputObjectSchema } from './NotificationCreateWithoutTaskInput.schema';
import { NotificationUncheckedCreateWithoutTaskInputObjectSchema as NotificationUncheckedCreateWithoutTaskInputObjectSchema } from './NotificationUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => NotificationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const NotificationCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.NotificationCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationCreateOrConnectWithoutTaskInput>;
export const NotificationCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
