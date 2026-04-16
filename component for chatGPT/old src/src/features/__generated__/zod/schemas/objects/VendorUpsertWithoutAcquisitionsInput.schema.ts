import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutAcquisitionsInputObjectSchema as VendorUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUpdateWithoutAcquisitionsInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionsInput.schema';
import { VendorCreateWithoutAcquisitionsInputObjectSchema as VendorCreateWithoutAcquisitionsInputObjectSchema } from './VendorCreateWithoutAcquisitionsInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionsInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutAcquisitionsInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutAcquisitionsInput>;
export const VendorUpsertWithoutAcquisitionsInputObjectZodSchema = makeSchema();
