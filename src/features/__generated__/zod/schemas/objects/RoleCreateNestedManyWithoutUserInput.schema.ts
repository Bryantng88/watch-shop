import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutUserInputObjectSchema as RoleCreateWithoutUserInputObjectSchema } from './RoleCreateWithoutUserInput.schema';
import { RoleUncheckedCreateWithoutUserInputObjectSchema as RoleUncheckedCreateWithoutUserInputObjectSchema } from './RoleUncheckedCreateWithoutUserInput.schema';
import { RoleCreateOrConnectWithoutUserInputObjectSchema as RoleCreateOrConnectWithoutUserInputObjectSchema } from './RoleCreateOrConnectWithoutUserInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutUserInputObjectSchema), z.lazy(() => RoleCreateWithoutUserInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RoleCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateNestedManyWithoutUserInput>;
export const RoleCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
