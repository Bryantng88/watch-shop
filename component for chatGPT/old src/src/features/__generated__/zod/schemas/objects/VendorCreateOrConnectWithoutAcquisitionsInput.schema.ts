import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutAcquisitionsInputObjectSchema as VendorCreateWithoutAcquisitionsInputObjectSchema } from './VendorCreateWithoutAcquisitionsInput.schema';
import { VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema as VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema } from './VendorUncheckedCreateWithoutAcquisitionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutAcquisitionsInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutAcquisitionsInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutAcquisitionsInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutAcquisitionsInput>;
export const VendorCreateOrConnectWithoutAcquisitionsInputObjectZodSchema = makeSchema();
