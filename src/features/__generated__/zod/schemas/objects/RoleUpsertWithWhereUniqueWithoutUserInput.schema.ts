import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutUserInputObjectSchema as RoleUpdateWithoutUserInputObjectSchema } from './RoleUpdateWithoutUserInput.schema';
import { RoleUncheckedUpdateWithoutUserInputObjectSchema as RoleUncheckedUpdateWithoutUserInputObjectSchema } from './RoleUncheckedUpdateWithoutUserInput.schema';
import { RoleCreateWithoutUserInputObjectSchema as RoleCreateWithoutUserInputObjectSchema } from './RoleCreateWithoutUserInput.schema';
import { RoleUncheckedCreateWithoutUserInputObjectSchema as RoleUncheckedCreateWithoutUserInputObjectSchema } from './RoleUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RoleUpdateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => RoleCreateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const RoleUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithWhereUniqueWithoutUserInput>;
export const RoleUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
