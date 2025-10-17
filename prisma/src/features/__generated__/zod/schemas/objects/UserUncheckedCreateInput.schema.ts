import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema as CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema } from './CustomerUncheckedCreateNestedOneWithoutUserInput.schema';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutUserInputObjectSchema).optional(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema)
}).strict();
export const UserUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateInput>;
export const UserUncheckedCreateInputObjectZodSchema = makeSchema();
