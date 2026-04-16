import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleWhereUniqueInputObjectSchema as RoleWhereUniqueInputObjectSchema } from './RoleWhereUniqueInput.schema';
import { RoleUpdateWithoutUserInputObjectSchema as RoleUpdateWithoutUserInputObjectSchema } from './RoleUpdateWithoutUserInput.schema';
import { RoleUncheckedUpdateWithoutUserInputObjectSchema as RoleUncheckedUpdateWithoutUserInputObjectSchema } from './RoleUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateWithoutUserInputObjectSchema), z.lazy(() => RoleUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const RoleUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithWhereUniqueWithoutUserInput>;
export const RoleUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
