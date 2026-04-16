import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutOrderInputObjectSchema as CustomerCreateWithoutOrderInputObjectSchema } from './CustomerCreateWithoutOrderInput.schema';
import { CustomerUncheckedCreateWithoutOrderInputObjectSchema as CustomerUncheckedCreateWithoutOrderInputObjectSchema } from './CustomerUncheckedCreateWithoutOrderInput.schema';
import { CustomerCreateOrConnectWithoutOrderInputObjectSchema as CustomerCreateOrConnectWithoutOrderInputObjectSchema } from './CustomerCreateOrConnectWithoutOrderInput.schema';
import { CustomerUpsertWithoutOrderInputObjectSchema as CustomerUpsertWithoutOrderInputObjectSchema } from './CustomerUpsertWithoutOrderInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutOrderInputObjectSchema as CustomerUpdateToOneWithWhereWithoutOrderInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutOrderInput.schema';
import { CustomerUpdateWithoutOrderInputObjectSchema as CustomerUpdateWithoutOrderInputObjectSchema } from './CustomerUpdateWithoutOrderInput.schema';
import { CustomerUncheckedUpdateWithoutOrderInputObjectSchema as CustomerUncheckedUpdateWithoutOrderInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutOrderInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutOrderInputObjectSchema), z.lazy(() => CustomerUpdateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrderInputObjectSchema)]).optional()
}).strict();
export const CustomerUpdateOneWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateOneWithoutOrderNestedInput>;
export const CustomerUpdateOneWithoutOrderNestedInputObjectZodSchema = makeSchema();
