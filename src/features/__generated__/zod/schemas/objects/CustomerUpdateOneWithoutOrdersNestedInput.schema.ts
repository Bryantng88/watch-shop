import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutOrdersInputObjectSchema as CustomerCreateWithoutOrdersInputObjectSchema } from './CustomerCreateWithoutOrdersInput.schema';
import { CustomerUncheckedCreateWithoutOrdersInputObjectSchema as CustomerUncheckedCreateWithoutOrdersInputObjectSchema } from './CustomerUncheckedCreateWithoutOrdersInput.schema';
import { CustomerCreateOrConnectWithoutOrdersInputObjectSchema as CustomerCreateOrConnectWithoutOrdersInputObjectSchema } from './CustomerCreateOrConnectWithoutOrdersInput.schema';
import { CustomerUpsertWithoutOrdersInputObjectSchema as CustomerUpsertWithoutOrdersInputObjectSchema } from './CustomerUpsertWithoutOrdersInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutOrdersInputObjectSchema as CustomerUpdateToOneWithWhereWithoutOrdersInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutOrdersInput.schema';
import { CustomerUpdateWithoutOrdersInputObjectSchema as CustomerUpdateWithoutOrdersInputObjectSchema } from './CustomerUpdateWithoutOrdersInput.schema';
import { CustomerUncheckedUpdateWithoutOrdersInputObjectSchema as CustomerUncheckedUpdateWithoutOrdersInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrdersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutOrdersInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutOrdersInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUpdateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrdersInputObjectSchema)]).optional()
}).strict();
export const CustomerUpdateOneWithoutOrdersNestedInputObjectSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutOrdersNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateOneWithoutOrdersNestedInput>;
export const CustomerUpdateOneWithoutOrdersNestedInputObjectZodSchema = makeSchema();
