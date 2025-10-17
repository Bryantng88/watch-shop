import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutAcquisitionsInputObjectSchema as VendorCreateWithoutAcquisitionsInputObjectSchema } from './VendorCreateWithoutAcquisitionsInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionsInput.schema';
import { VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema as VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema } from './VendorCreateOrConnectWithoutAcquisitionsInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutAcquisitionsInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutAcquisitionsInput>;
export const VendorCreateNestedOneWithoutAcquisitionsInputObjectZodSchema = makeSchema();
