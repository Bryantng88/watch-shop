import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutAcquisitionInputObjectSchema as VendorCreateWithoutAcquisitionInputObjectSchema } from './VendorCreateWithoutAcquisitionInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionInput.schema';
import { VendorCreateOrConnectWithoutAcquisitionInputObjectSchema as VendorCreateOrConnectWithoutAcquisitionInputObjectSchema } from './VendorCreateOrConnectWithoutAcquisitionInput.schema';
import { VendorUpsertWithoutAcquisitionInputObjectSchema as VendorUpsertWithoutAcquisitionInputObjectSchema } from './VendorUpsertWithoutAcquisitionInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema as VendorUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutAcquisitionInput.schema';
import { VendorUpdateWithoutAcquisitionInputObjectSchema as VendorUpdateWithoutAcquisitionInputObjectSchema } from './VendorUpdateWithoutAcquisitionInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutAcquisitionInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutAcquisitionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutAcquisitionNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutAcquisitionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutAcquisitionNestedInput>;
export const VendorUpdateOneWithoutAcquisitionNestedInputObjectZodSchema = makeSchema();
