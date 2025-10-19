import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutUsersInputObjectSchema as RoleUpdateWithoutUsersInputObjectSchema } from './RoleUpdateWithoutUsersInput.schema';
import { RoleUncheckedUpdateWithoutUsersInputObjectSchema as RoleUncheckedUpdateWithoutUsersInputObjectSchema } from './RoleUncheckedUpdateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateWithoutUsersInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const RoleUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutUsersInput>;
export const RoleUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = makeSchema();
