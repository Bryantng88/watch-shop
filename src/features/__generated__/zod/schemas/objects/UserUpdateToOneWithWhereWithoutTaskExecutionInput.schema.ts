import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutTaskExecutionInputObjectSchema as UserUpdateWithoutTaskExecutionInputObjectSchema } from './UserUpdateWithoutTaskExecutionInput.schema';
import { UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema as UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './UserUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutTaskExecutionInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTaskExecutionInput>;
export const UserUpdateToOneWithWhereWithoutTaskExecutionInputObjectZodSchema = makeSchema();
