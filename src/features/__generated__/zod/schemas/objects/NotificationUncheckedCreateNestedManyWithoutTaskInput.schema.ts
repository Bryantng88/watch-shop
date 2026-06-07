import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationCreateWithoutTaskInputObjectSchema as NotificationCreateWithoutTaskInputObjectSchema } from './NotificationCreateWithoutTaskInput.schema';
import { NotificationUncheckedCreateWithoutTaskInputObjectSchema as NotificationUncheckedCreateWithoutTaskInputObjectSchema } from './NotificationUncheckedCreateWithoutTaskInput.schema';
import { NotificationCreateOrConnectWithoutTaskInputObjectSchema as NotificationCreateOrConnectWithoutTaskInputObjectSchema } from './NotificationCreateOrConnectWithoutTaskInput.schema';
import { NotificationCreateManyTaskInputEnvelopeObjectSchema as NotificationCreateManyTaskInputEnvelopeObjectSchema } from './NotificationCreateManyTaskInputEnvelope.schema';
import { NotificationWhereUniqueInputObjectSchema as NotificationWhereUniqueInputObjectSchema } from './NotificationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => NotificationCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => NotificationCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => NotificationCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => NotificationWhereUniqueInputObjectSchema), z.lazy(() => NotificationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const NotificationUncheckedCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUncheckedCreateNestedManyWithoutTaskInput>;
export const NotificationUncheckedCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
