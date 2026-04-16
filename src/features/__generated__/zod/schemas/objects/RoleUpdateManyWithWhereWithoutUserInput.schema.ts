import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { RoleScalarWhereInputObjectSchema as RoleScalarWhereInputObjectSchema } from './RoleScalarWhereInput.schema';
import { RoleUpdateManyMutationInputObjectSchema as RoleUpdateManyMutationInputObjectSchema } from './RoleUpdateManyMutationInput.schema';
import { RoleUncheckedUpdateManyWithoutUserInputObjectSchema as RoleUncheckedUpdateManyWithoutUserInputObjectSchema } from './RoleUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RoleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RoleUpdateManyMutationInputObjectSchema), z.lazy(() => RoleUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const RoleUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateManyWithWhereWithoutUserInput>;
export const RoleUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
