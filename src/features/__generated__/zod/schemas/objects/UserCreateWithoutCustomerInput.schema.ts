import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateNestedManyWithoutUsersInputObjectSchema as RoleCreateNestedManyWithoutUsersInputObjectSchema } from './RoleCreateNestedManyWithoutUsersInput.schema'

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
  roles: z.lazy(() => RoleCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const UserCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutCustomerInput>;
export const UserCreateWithoutCustomerInputObjectZodSchema = makeSchema();
