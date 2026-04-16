import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutAcquisitionInputObjectSchema as VendorUpdateWithoutAcquisitionInputObjectSchema } from './VendorUpdateWithoutAcquisitionInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionInput.schema';
import { VendorCreateWithoutAcquisitionInputObjectSchema as VendorCreateWithoutAcquisitionInputObjectSchema } from './VendorCreateWithoutAcquisitionInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutAcquisitionInput>;
export const VendorUpsertWithoutAcquisitionInputObjectZodSchema = makeSchema();
