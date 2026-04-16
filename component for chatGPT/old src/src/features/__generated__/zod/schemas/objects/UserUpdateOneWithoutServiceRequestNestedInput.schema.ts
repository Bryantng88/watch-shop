import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateWithoutServiceRequestInputObjectSchema as UserCreateWithoutServiceRequestInputObjectSchema } from './UserCreateWithoutServiceRequestInput.schema';
import { UserUncheckedCreateWithoutServiceRequestInputObjectSchema as UserUncheckedCreateWithoutServiceRequestInputObjectSchema } from './UserUncheckedCreateWithoutServiceRequestInput.schema';
import { UserCreateOrConnectWithoutServiceRequestInputObjectSchema as UserCreateOrConnectWithoutServiceRequestInputObjectSchema } from './UserCreateOrConnectWithoutServiceRequestInput.schema';
import { UserUpsertWithoutServiceRequestInputObjectSchema as UserUpsertWithoutServiceRequestInputObjectSchema } from './UserUpsertWithoutServiceRequestInput.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as UserUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './UserUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { UserUpdateWithoutServiceRequestInputObjectSchema as UserUpdateWithoutServiceRequestInputObjectSchema } from './UserUpdateWithoutServiceRequestInput.schema';
import { UserUncheckedUpdateWithoutServiceRequestInputObjectSchema as UserUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './UserUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => UserCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const UserUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneWithoutServiceRequestNestedInput>;
export const UserUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
