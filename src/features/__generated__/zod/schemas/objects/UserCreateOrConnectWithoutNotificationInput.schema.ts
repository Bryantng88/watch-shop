import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserCreateWithoutNotificationInputObjectSchema as UserCreateWithoutNotificationInputObjectSchema } from './UserCreateWithoutNotificationInput.schema';
import { UserUncheckedCreateWithoutNotificationInputObjectSchema as UserUncheckedCreateWithoutNotificationInputObjectSchema } from './UserUncheckedCreateWithoutNotificationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => UserCreateWithoutNotificationInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutNotificationInputObjectSchema)])
}).strict();
export const UserCreateOrConnectWithoutNotificationInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutNotificationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutNotificationInput>;
export const UserCreateOrConnectWithoutNotificationInputObjectZodSchema = makeSchema();
