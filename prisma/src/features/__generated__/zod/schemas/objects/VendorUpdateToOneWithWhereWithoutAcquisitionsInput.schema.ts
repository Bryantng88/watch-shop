import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutAcquisitionsInputObjectSchema as VendorUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUpdateWithoutAcquisitionsInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutAcquisitionsInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutAcquisitionsInput>;
export const VendorUpdateToOneWithWhereWithoutAcquisitionsInputObjectZodSchema = makeSchema();
