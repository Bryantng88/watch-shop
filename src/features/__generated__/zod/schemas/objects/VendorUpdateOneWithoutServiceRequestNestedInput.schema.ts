import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutServiceRequestInputObjectSchema as VendorCreateWithoutServiceRequestInputObjectSchema } from './VendorCreateWithoutServiceRequestInput.schema';
import { VendorUncheckedCreateWithoutServiceRequestInputObjectSchema as VendorUncheckedCreateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedCreateWithoutServiceRequestInput.schema';
import { VendorCreateOrConnectWithoutServiceRequestInputObjectSchema as VendorCreateOrConnectWithoutServiceRequestInputObjectSchema } from './VendorCreateOrConnectWithoutServiceRequestInput.schema';
import { VendorUpsertWithoutServiceRequestInputObjectSchema as VendorUpsertWithoutServiceRequestInputObjectSchema } from './VendorUpsertWithoutServiceRequestInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as VendorUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { VendorUpdateWithoutServiceRequestInputObjectSchema as VendorUpdateWithoutServiceRequestInputObjectSchema } from './VendorUpdateWithoutServiceRequestInput.schema';
import { VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema as VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutServiceRequestNestedInput>;
export const VendorUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
