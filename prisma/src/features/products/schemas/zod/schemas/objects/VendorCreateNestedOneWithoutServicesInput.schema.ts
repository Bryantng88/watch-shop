import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutServicesInputObjectSchema as VendorCreateWithoutServicesInputObjectSchema } from './VendorCreateWithoutServicesInput.schema';
import { VendorUncheckedCreateWithoutServicesInputObjectSchema as VendorUncheckedCreateWithoutServicesInputObjectSchema } from './VendorUncheckedCreateWithoutServicesInput.schema';
import { VendorCreateOrConnectWithoutServicesInputObjectSchema as VendorCreateOrConnectWithoutServicesInputObjectSchema } from './VendorCreateOrConnectWithoutServicesInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServicesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutServicesInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutServicesInput>;
export const VendorCreateNestedOneWithoutServicesInputObjectZodSchema = makeSchema();
