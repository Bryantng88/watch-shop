import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutUsersInputObjectSchema as RoleUpdateWithoutUsersInputObjectSchema } from './RoleUpdateWithoutUsersInput.schema';
import { RoleUncheckedUpdateWithoutUsersInputObjectSchema as RoleUncheckedUpdateWithoutUsersInputObjectSchema } from './RoleUncheckedUpdateWithoutUsersInput.schema';
import { RoleCreateWithoutUsersInputObjectSchema as RoleCreateWithoutUsersInputObjectSchema } from './RoleCreateWithoutUsersInput.schema';
import { RoleUncheckedCreateWithoutUsersInputObjectSchema as RoleUncheckedCreateWithoutUsersInputObjectSchema } from './RoleUncheckedCreateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoleUpdateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => RoleCreateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const RoleUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutUsersInput>;
export const RoleUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = makeSchema();
