import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UserUpdateWithoutServiceRequestInputObjectSchema as UserUpdateWithoutServiceRequestInputObjectSchema } from './UserUpdateWithoutServiceRequestInput.schema';
import { UserUncheckedUpdateWithoutServiceRequestInputObjectSchema as UserUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './UserUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => UserWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => UserUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const UserUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutServiceRequestInput>;
export const UserUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
