import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema as RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './RoleUncheckedCreateNestedManyWithoutUsersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string(),
  passwordHash: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  roleId: z.string().optional().nullable(),
  roles: z.lazy(() => RoleUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const UserUncheckedCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUncheckedCreateWithoutCustomerInput>;
export const UserUncheckedCreateWithoutCustomerInputObjectZodSchema = makeSchema();
