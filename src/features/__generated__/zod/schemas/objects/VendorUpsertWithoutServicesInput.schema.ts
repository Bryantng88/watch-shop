import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutServicesInputObjectSchema as VendorUpdateWithoutServicesInputObjectSchema } from './VendorUpdateWithoutServicesInput.schema';
import { VendorUncheckedUpdateWithoutServicesInputObjectSchema as VendorUncheckedUpdateWithoutServicesInputObjectSchema } from './VendorUncheckedUpdateWithoutServicesInput.schema';
import { VendorCreateWithoutServicesInputObjectSchema as VendorCreateWithoutServicesInputObjectSchema } from './VendorCreateWithoutServicesInput.schema';
import { VendorUncheckedCreateWithoutServicesInputObjectSchema as VendorUncheckedCreateWithoutServicesInputObjectSchema } from './VendorUncheckedCreateWithoutServicesInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServicesInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServicesInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutServicesInput>;
export const VendorUpsertWithoutServicesInputObjectZodSchema = makeSchema();
