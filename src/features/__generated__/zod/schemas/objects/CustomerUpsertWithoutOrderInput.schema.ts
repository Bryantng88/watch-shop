import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutOrderInputObjectSchema as CustomerUpdateWithoutOrderInputObjectSchema } from './CustomerUpdateWithoutOrderInput.schema';
import { CustomerUncheckedUpdateWithoutOrderInputObjectSchema as CustomerUncheckedUpdateWithoutOrderInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrderInput.schema';
import { CustomerCreateWithoutOrderInputObjectSchema as CustomerCreateWithoutOrderInputObjectSchema } from './CustomerCreateWithoutOrderInput.schema';
import { CustomerUncheckedCreateWithoutOrderInputObjectSchema as CustomerUncheckedCreateWithoutOrderInputObjectSchema } from './CustomerUncheckedCreateWithoutOrderInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrderInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutOrderInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutOrderInput>;
export const CustomerUpsertWithoutOrderInputObjectZodSchema = makeSchema();
