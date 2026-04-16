import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleCreateWithoutUserInputObjectSchema as RoleCreateWithoutUserInputObjectSchema } from './RoleCreateWithoutUserInput.schema';
import { RoleUncheckedCreateWithoutUserInputObjectSchema as RoleUncheckedCreateWithoutUserInputObjectSchema } from './RoleUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RoleCreateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const RoleCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutUserInput>;
export const RoleCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
