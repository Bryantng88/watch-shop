import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereUniqueInputObjectSchema as UserWhereUniqueInputObjectSchema } from './UserWhereUniqueInput.schema';
import { UserUpdateWithoutRolesInputObjectSchema as UserUpdateWithoutRolesInputObjectSchema } from './UserUpdateWithoutRolesInput.schema';
import { UserUncheckedUpdateWithoutRolesInputObjectSchema as UserUncheckedUpdateWithoutRolesInputObjectSchema } from './UserUncheckedUpdateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => UserUpdateWithoutRolesInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutRolesInputObjectSchema)])
}).strict();
export const UserUpdateWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutRolesInput>;
export const UserUpdateWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();
