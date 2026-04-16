import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutNotificationInputObjectSchema as UserCreateWithoutNotificationInputObjectSchema } from './UserCreateWithoutNotificationInput.schema';
import { UserUncheckedCreateWithoutNotificationInputObjectSchema as UserUncheckedCreateWithoutNotificationInputObjectSchema } from './UserUncheckedCreateWithoutNotificationInput.schema';
import { UserCreateOrConnectWithoutNotificationInputObjectSchema as UserCreateOrConnectWithoutNotificationInputObjectSchema } from './UserCreateOrConnectWithoutNotificationInput.schema';
import { UserUpsertWithoutNotificationInputObjectSchema as UserUpsertWithoutNotificationInputObjectSchema } from './UserUpsertWithoutNotificationInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutNotificationInputObjectSchema as UserUpdateToOneWithWhereWithoutNotificationInputObjectSchema } from './UserUpdateToOneWithWhereWithoutNotificationInput.schema';
import { UserUpdateWithoutNotificationInputObjectSchema as UserUpdateWithoutNotificationInputObjectSchema } from './UserUpdateWithoutNotificationInput.schema';
import { UserUncheckedUpdateWithoutNotificationInputObjectSchema as UserUncheckedUpdateWithoutNotificationInputObjectSchema } from './UserUncheckedUpdateWithoutNotificationInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutNotificationInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotificationInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutNotificationInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutNotificationInputObjectSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutNotificationInputObjectSchema), z.lazy(() => UserUpdateWithoutNotificationInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutNotificationInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneRequiredWithoutNotificationNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotificationNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutNotificationNestedInput>;
export const UserUpdateOneRequiredWithoutNotificationNestedInputObjectZodSchema = makeSchema();
