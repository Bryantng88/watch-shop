import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationScalarWhereInputObjectSchema as WatchStrapInstallationScalarWhereInputObjectSchema } from './WatchStrapInstallationScalarWhereInput.schema';
import { WatchStrapInstallationUpdateManyMutationInputObjectSchema as WatchStrapInstallationUpdateManyMutationInputObjectSchema } from './WatchStrapInstallationUpdateManyMutationInput.schema';
import { WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchStrapInstallationUpdateManyMutationInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInput>;
export const WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectZodSchema = makeSchema();
