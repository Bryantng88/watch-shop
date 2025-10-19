import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutOrdersInputObjectSchema as CustomerUpdateWithoutOrdersInputObjectSchema } from './CustomerUpdateWithoutOrdersInput.schema';
import { CustomerUncheckedUpdateWithoutOrdersInputObjectSchema as CustomerUncheckedUpdateWithoutOrdersInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrdersInput.schema';
import { CustomerCreateWithoutOrdersInputObjectSchema as CustomerCreateWithoutOrdersInputObjectSchema } from './CustomerCreateWithoutOrdersInput.schema';
import { CustomerUncheckedCreateWithoutOrdersInputObjectSchema as CustomerUncheckedCreateWithoutOrdersInputObjectSchema } from './CustomerUncheckedCreateWithoutOrdersInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrdersInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrdersInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutOrdersInput>;
export const CustomerUpsertWithoutOrdersInputObjectZodSchema = makeSchema();
