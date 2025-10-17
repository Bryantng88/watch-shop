import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutProductInputObjectSchema as VendorCreateWithoutProductInputObjectSchema } from './VendorCreateWithoutProductInput.schema';
import { VendorUncheckedCreateWithoutProductInputObjectSchema as VendorUncheckedCreateWithoutProductInputObjectSchema } from './VendorUncheckedCreateWithoutProductInput.schema';
import { VendorCreateOrConnectWithoutProductInputObjectSchema as VendorCreateOrConnectWithoutProductInputObjectSchema } from './VendorCreateOrConnectWithoutProductInput.schema';
import { VendorUpsertWithoutProductInputObjectSchema as VendorUpsertWithoutProductInputObjectSchema } from './VendorUpsertWithoutProductInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutProductInputObjectSchema as VendorUpdateToOneWithWhereWithoutProductInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutProductInput.schema';
import { VendorUpdateWithoutProductInputObjectSchema as VendorUpdateWithoutProductInputObjectSchema } from './VendorUpdateWithoutProductInput.schema';
import { VendorUncheckedUpdateWithoutProductInputObjectSchema as VendorUncheckedUpdateWithoutProductInputObjectSchema } from './VendorUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => VendorUpdateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutProductNestedInput>;
export const VendorUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();
