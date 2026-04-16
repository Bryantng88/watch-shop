import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutServicesInputObjectSchema as VendorCreateWithoutServicesInputObjectSchema } from './VendorCreateWithoutServicesInput.schema';
import { VendorUncheckedCreateWithoutServicesInputObjectSchema as VendorUncheckedCreateWithoutServicesInputObjectSchema } from './VendorUncheckedCreateWithoutServicesInput.schema';
import { VendorCreateOrConnectWithoutServicesInputObjectSchema as VendorCreateOrConnectWithoutServicesInputObjectSchema } from './VendorCreateOrConnectWithoutServicesInput.schema';
import { VendorUpsertWithoutServicesInputObjectSchema as VendorUpsertWithoutServicesInputObjectSchema } from './VendorUpsertWithoutServicesInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutServicesInputObjectSchema as VendorUpdateToOneWithWhereWithoutServicesInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutServicesInput.schema';
import { VendorUpdateWithoutServicesInputObjectSchema as VendorUpdateWithoutServicesInputObjectSchema } from './VendorUpdateWithoutServicesInput.schema';
import { VendorUncheckedUpdateWithoutServicesInputObjectSchema as VendorUncheckedUpdateWithoutServicesInputObjectSchema } from './VendorUncheckedUpdateWithoutServicesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServicesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutServicesInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutServicesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutServicesInputObjectSchema), z.lazy(() => VendorUpdateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServicesInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutServicesNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutServicesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutServicesNestedInput>;
export const VendorUpdateOneWithoutServicesNestedInputObjectZodSchema = makeSchema();
