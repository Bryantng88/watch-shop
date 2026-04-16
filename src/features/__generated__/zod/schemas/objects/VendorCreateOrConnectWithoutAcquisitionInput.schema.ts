import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutAcquisitionInputObjectSchema as VendorCreateWithoutAcquisitionInputObjectSchema } from './VendorCreateWithoutAcquisitionInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutAcquisitionInput>;
export const VendorCreateOrConnectWithoutAcquisitionInputObjectZodSchema = makeSchema();
