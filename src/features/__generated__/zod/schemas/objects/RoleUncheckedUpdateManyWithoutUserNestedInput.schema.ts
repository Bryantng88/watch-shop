import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleCreateWithoutUserInputObjectSchema as RoleCreateWithoutUserInputObjectSchema } from './RoleCreateWithoutUserInput.schema';
import { RoleUncheckedCreateWithoutUserInputObjectSchema as RoleUncheckedCreateWithoutUserInputObjectSchema } from './RoleUncheckedCreateWithoutUserInput.schema';
import { RoleCreateOrConnectWithoutUserInputObjectSchema as RoleCreateOrConnectWithoutUserInputObjectSchema } from './RoleCreateOrConnectWithoutUserInput.schema';
import { RoleUpsertWithWhereUniqueWithoutUserInputObjectSchema as RoleUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './RoleUpsertWithWhereUniqueWithoutUserInput.schema';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithWhereUniqueWithoutUserInputObjectSchema as RoleUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './RoleUpdateWithWhereUniqueWithoutUserInput.schema';
import { RoleUpdateManyWithWhereWithoutUserInputObjectSchema as RoleUpdateManyWithWhereWithoutUserInputObjectSchema } from './RoleUpdateManyWithWhereWithoutUserInput.schema';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RoleCreateWithoutUserInputObjectSchema), z.lazy(() => RoleCreateWithoutUserInputObjectSchema).array(), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RoleCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => RoleCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RoleUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => RoleUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RoleWhereUniqueInputObjectSchema), z.lazy(() => RoleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RoleUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => RoleUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RoleUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => RoleUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RoleUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedUpdateManyWithoutUserNestedInput>;
export const RoleUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
