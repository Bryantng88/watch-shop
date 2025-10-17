import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutAcquisitionInputObjectSchema as CustomerCreateWithoutAcquisitionInputObjectSchema } from './CustomerCreateWithoutAcquisitionInput.schema';
import { CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema as CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedCreateWithoutAcquisitionInput.schema';
import { CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema as CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema } from './CustomerCreateOrConnectWithoutAcquisitionInput.schema';
import { CustomerUpsertWithoutAcquisitionInputObjectSchema as CustomerUpsertWithoutAcquisitionInputObjectSchema } from './CustomerUpsertWithoutAcquisitionInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema as CustomerUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutAcquisitionInput.schema';
import { CustomerUpdateWithoutAcquisitionInputObjectSchema as CustomerUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUpdateWithoutAcquisitionInput.schema';
import { CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema as CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutAcquisitionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema)]).optional()
}).strict();
export const CustomerUpdateOneWithoutAcquisitionNestedInputObjectSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutAcquisitionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateOneWithoutAcquisitionNestedInput>;
export const CustomerUpdateOneWithoutAcquisitionNestedInputObjectZodSchema = makeSchema();
