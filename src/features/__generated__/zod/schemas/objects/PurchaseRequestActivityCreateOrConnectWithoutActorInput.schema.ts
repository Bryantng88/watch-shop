import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityCreateWithoutActorInputObjectSchema as PurchaseRequestActivityCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateOrConnectWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateOrConnectWithoutActorInput>;
export const PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectZodSchema = makeSchema();
