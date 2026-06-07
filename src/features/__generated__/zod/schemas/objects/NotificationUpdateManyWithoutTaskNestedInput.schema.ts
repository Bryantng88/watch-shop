import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationCreateWithoutTaskInputObjectSchema as NotificationCreateWithoutTaskInputObjectSchema } from './NotificationCreateWithoutTaskInput.schema';
import { NotificationUncheckedCreateWithoutTaskInputObjectSchema as NotificationUncheckedCreateWithoutTaskInputObjectSchema } from './NotificationUncheckedCreateWithoutTaskInput.schema';
import { NotificationCreateOrConnectWithoutTaskInputObjectSchema as NotificationCreateOrConnectWithoutTaskInputObjectSchema } from './NotificationCreateOrConnectWithoutTaskInput.schema';
import { NotificationUpsertWithWhereUniqueWithoutTaskInputObjectSchema as NotificationUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './NotificationUpsertWithWhereUniqueWithoutTaskInput.schema';
import { NotificationCreateManyTaskInputEnvelopeObjectSchema as NotificationCreateManyTaskInputEnvelopeObjectSchema } from './NotificationCreateManyTaskInputEnvelope.schema';
import { NotificationWhereUniqueInputObjectSchema as NotificationWhereUniqueInputObjectSchema } from './NotificationWhereUniqueInput.schema';
import { NotificationUpdateWithWhereUniqueWithoutTaskInputObjectSchema as NotificationUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './NotificationUpdateWithWhereUniqueWithoutTaskInput.schema';
import { NotificationUpdateManyWithWhereWithoutTaskInputObjectSchema as NotificationUpdateManyWithWhereWithoutTaskInputObjectSchema } from './NotificationUpdateManyWithWhereWithoutTaskInput.schema';
import { NotificationScalarWhereInputObjectSchema as NotificationScalarWhereInputObjectSchema } from './NotificationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => NotificationUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => NotificationCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => NotificationCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => NotificationUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => NotificationUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => NotificationCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => NotificationWhereUniqueInputObjectSchema), z.lazy(() => NotificationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => NotificationWhereUniqueInputObjectSchema), z.lazy(() => NotificationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => NotificationWhereUniqueInputObjectSchema), z.lazy(() => NotificationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => NotificationWhereUniqueInputObjectSchema), z.lazy(() => NotificationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => NotificationUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => NotificationUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => NotificationUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => NotificationUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => NotificationScalarWhereInputObjectSchema), z.lazy(() => NotificationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const NotificationUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.NotificationUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUpdateManyWithoutTaskNestedInput>;
export const NotificationUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
