import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutAcquisitionInputObjectSchema as VendorUpdateWithoutAcquisitionInputObjectSchema } from './VendorUpdateWithoutAcquisitionInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutAcquisitionInput>;
export const VendorUpdateToOneWithWhereWithoutAcquisitionInputObjectZodSchema = makeSchema();
