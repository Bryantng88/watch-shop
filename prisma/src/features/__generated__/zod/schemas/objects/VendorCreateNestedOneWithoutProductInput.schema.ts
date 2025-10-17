import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutProductInputObjectSchema as VendorCreateWithoutProductInputObjectSchema } from './VendorCreateWithoutProductInput.schema';
import { VendorUncheckedCreateWithoutProductInputObjectSchema as VendorUncheckedCreateWithoutProductInputObjectSchema } from './VendorUncheckedCreateWithoutProductInput.schema';
import { VendorCreateOrConnectWithoutProductInputObjectSchema as VendorCreateOrConnectWithoutProductInputObjectSchema } from './VendorCreateOrConnectWithoutProductInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutProductInput>;
export const VendorCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();
