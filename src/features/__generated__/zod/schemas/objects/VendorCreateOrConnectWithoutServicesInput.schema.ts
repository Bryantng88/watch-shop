import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutServicesInputObjectSchema as VendorCreateWithoutServicesInputObjectSchema } from './VendorCreateWithoutServicesInput.schema';
import { VendorUncheckedCreateWithoutServicesInputObjectSchema as VendorUncheckedCreateWithoutServicesInputObjectSchema } from './VendorUncheckedCreateWithoutServicesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServicesInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutServicesInput>;
export const VendorCreateOrConnectWithoutServicesInputObjectZodSchema = makeSchema();
