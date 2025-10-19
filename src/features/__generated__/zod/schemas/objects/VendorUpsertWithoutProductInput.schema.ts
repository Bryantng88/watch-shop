import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutProductInputObjectSchema as VendorUpdateWithoutProductInputObjectSchema } from './VendorUpdateWithoutProductInput.schema';
import { VendorUncheckedUpdateWithoutProductInputObjectSchema as VendorUncheckedUpdateWithoutProductInputObjectSchema } from './VendorUncheckedUpdateWithoutProductInput.schema';
import { VendorCreateWithoutProductInputObjectSchema as VendorCreateWithoutProductInputObjectSchema } from './VendorCreateWithoutProductInput.schema';
import { VendorUncheckedCreateWithoutProductInputObjectSchema as VendorUncheckedCreateWithoutProductInputObjectSchema } from './VendorUncheckedCreateWithoutProductInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutProductInput>;
export const VendorUpsertWithoutProductInputObjectZodSchema = makeSchema();
