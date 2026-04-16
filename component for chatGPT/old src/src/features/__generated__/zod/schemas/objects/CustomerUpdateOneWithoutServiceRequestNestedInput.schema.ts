import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutServiceRequestInputObjectSchema as CustomerCreateWithoutServiceRequestInputObjectSchema } from './CustomerCreateWithoutServiceRequestInput.schema';
import { CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema as CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedCreateWithoutServiceRequestInput.schema';
import { CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema as CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema } from './CustomerCreateOrConnectWithoutServiceRequestInput.schema';
import { CustomerUpsertWithoutServiceRequestInputObjectSchema as CustomerUpsertWithoutServiceRequestInputObjectSchema } from './CustomerUpsertWithoutServiceRequestInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as CustomerUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { CustomerUpdateWithoutServiceRequestInputObjectSchema as CustomerUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUpdateWithoutServiceRequestInput.schema';
import { CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema as CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const CustomerUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateOneWithoutServiceRequestNestedInput>;
export const CustomerUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
