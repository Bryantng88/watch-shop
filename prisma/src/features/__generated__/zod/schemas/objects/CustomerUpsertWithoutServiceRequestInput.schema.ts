import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutServiceRequestInputObjectSchema as CustomerUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUpdateWithoutServiceRequestInput.schema';
import { CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema as CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedUpdateWithoutServiceRequestInput.schema';
import { CustomerCreateWithoutServiceRequestInputObjectSchema as CustomerCreateWithoutServiceRequestInputObjectSchema } from './CustomerCreateWithoutServiceRequestInput.schema';
import { CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema as CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedCreateWithoutServiceRequestInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutServiceRequestInput>;
export const CustomerUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
