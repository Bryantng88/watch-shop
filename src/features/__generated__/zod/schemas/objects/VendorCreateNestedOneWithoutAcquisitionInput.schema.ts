import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutAcquisitionInputObjectSchema as VendorCreateWithoutAcquisitionInputObjectSchema } from './VendorCreateWithoutAcquisitionInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionInput.schema';
import { VendorCreateOrConnectWithoutAcquisitionInputObjectSchema as VendorCreateOrConnectWithoutAcquisitionInputObjectSchema } from './VendorCreateOrConnectWithoutAcquisitionInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutAcquisitionInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutAcquisitionInput>;
export const VendorCreateNestedOneWithoutAcquisitionInputObjectZodSchema = makeSchema();
