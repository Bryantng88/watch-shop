import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutAcquisitionsInputObjectSchema as VendorCreateWithoutAcquisitionsInputObjectSchema } from './VendorCreateWithoutAcquisitionsInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionsInput.schema';
import { VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema as VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema } from './VendorCreateOrConnectWithoutAcquisitionsInput.schema';
import { VendorUpsertWithoutAcquisitionsInputObjectSchema as VendorUpsertWithoutAcquisitionsInputObjectSchema } from './VendorUpsertWithoutAcquisitionsInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutAcquisitionsInputObjectSchema as VendorUpdateToOneWithWhereWithoutAcquisitionsInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutAcquisitionsInput.schema';
import { VendorUpdateWithoutAcquisitionsInputObjectSchema as VendorUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUpdateWithoutAcquisitionsInput.schema';
import { VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema as VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedUpdateWithoutAcquisitionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutAcquisitionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUpdateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutAcquisitionsInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutAcquisitionsNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutAcquisitionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutAcquisitionsNestedInput>;
export const VendorUpdateOneWithoutAcquisitionsNestedInputObjectZodSchema = makeSchema();
