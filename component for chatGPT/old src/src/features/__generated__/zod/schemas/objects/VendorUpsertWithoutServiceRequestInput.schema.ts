import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutServiceRequestInputObjectSchema as VendorUpdateWithoutServiceRequestInputObjectSchema } from './VendorUpdateWithoutServiceRequestInput.schema';
import { VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema as VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedUpdateWithoutServiceRequestInput.schema';
import { VendorCreateWithoutServiceRequestInputObjectSchema as VendorCreateWithoutServiceRequestInputObjectSchema } from './VendorCreateWithoutServiceRequestInput.schema';
import { VendorUncheckedCreateWithoutServiceRequestInputObjectSchema as VendorUncheckedCreateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedCreateWithoutServiceRequestInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutServiceRequestInput>;
export const VendorUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
