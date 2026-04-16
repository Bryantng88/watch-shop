import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutRoleInputObjectSchema as UserUpdateWithoutRoleInputObjectSchema } from './UserUpdateWithoutRoleInput.schema';
import { UserUncheckedUpdateWithoutRoleInputObjectSchema as UserUncheckedUpdateWithoutRoleInputObjectSchema } from './UserUncheckedUpdateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UserUpdateWithoutRoleInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRoleInputObjectSchema)])
}).strict();
export const UserUpdateWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutRoleInput>;
export const UserUpdateWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();
