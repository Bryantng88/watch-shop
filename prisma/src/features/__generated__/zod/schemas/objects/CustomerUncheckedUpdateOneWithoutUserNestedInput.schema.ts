import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutUserInputObjectSchema as CustomerCreateWithoutUserInputObjectSchema } from './CustomerCreateWithoutUserInput.schema';
import { CustomerUncheckedCreateWithoutUserInputObjectSchema as CustomerUncheckedCreateWithoutUserInputObjectSchema } from './CustomerUncheckedCreateWithoutUserInput.schema';
import { CustomerCreateOrConnectWithoutUserInputObjectSchema as CustomerCreateOrConnectWithoutUserInputObjectSchema } from './CustomerCreateOrConnectWithoutUserInput.schema';
import { CustomerUpsertWithoutUserInputObjectSchema as CustomerUpsertWithoutUserInputObjectSchema } from './CustomerUpsertWithoutUserInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutUserInputObjectSchema as CustomerUpdateToOneWithWhereWithoutUserInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutUserInput.schema';
import { CustomerUpdateWithoutUserInputObjectSchema as CustomerUpdateWithoutUserInputObjectSchema } from './CustomerUpdateWithoutUserInput.schema';
import { CustomerUncheckedUpdateWithoutUserInputObjectSchema as CustomerUncheckedUpdateWithoutUserInputObjectSchema } from './CustomerUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutUserInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutUserInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutUserInputObjectSchema), z.lazy(() => CustomerUpdateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutUserInputObjectSchema)]).optional()
}).strict();
export const CustomerUncheckedUpdateOneWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedUpdateOneWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedUpdateOneWithoutUserNestedInput>;
export const CustomerUncheckedUpdateOneWithoutUserNestedInputObjectZodSchema = makeSchema();
