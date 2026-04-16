import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutInvoiceInputObjectSchema as AcquisitionCreateWithoutInvoiceInputObjectSchema } from './AcquisitionCreateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedCreateWithoutInvoiceInput.schema';
import { AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema as AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema } from './AcquisitionCreateOrConnectWithoutInvoiceInput.schema';
import { AcquisitionUpsertWithoutInvoiceInputObjectSchema as AcquisitionUpsertWithoutInvoiceInputObjectSchema } from './AcquisitionUpsertWithoutInvoiceInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateToOneWithWhereWithoutInvoiceInputObjectSchema as AcquisitionUpdateToOneWithWhereWithoutInvoiceInputObjectSchema } from './AcquisitionUpdateToOneWithWhereWithoutInvoiceInput.schema';
import { AcquisitionUpdateWithoutInvoiceInputObjectSchema as AcquisitionUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUpdateWithoutInvoiceInput.schema';
import { AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema as AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcquisitionCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  upsert: z.lazy(() => AcquisitionUpsertWithoutInvoiceInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateToOneWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutInvoiceInputObjectSchema)]).optional()
}).strict();
export const AcquisitionUpdateOneWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateOneWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateOneWithoutInvoiceNestedInput>;
export const AcquisitionUpdateOneWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
