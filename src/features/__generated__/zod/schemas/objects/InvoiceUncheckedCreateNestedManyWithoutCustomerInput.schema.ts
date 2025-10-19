import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutCustomerInputObjectSchema as InvoiceCreateWithoutCustomerInputObjectSchema } from './InvoiceCreateWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateWithoutCustomerInput.schema';
import { InvoiceCreateOrConnectWithoutCustomerInputObjectSchema as InvoiceCreateOrConnectWithoutCustomerInputObjectSchema } from './InvoiceCreateOrConnectWithoutCustomerInput.schema';
import { InvoiceCreateManyCustomerInputEnvelopeObjectSchema as InvoiceCreateManyCustomerInputEnvelopeObjectSchema } from './InvoiceCreateManyCustomerInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutCustomerInput>;
export const InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectZodSchema = makeSchema();
