import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithoutActorInputObjectSchema as PurchaseRequestActivityUpdateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUpdateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateWithoutActorInput.schema';
import { PurchaseRequestActivityCreateWithoutActorInputObjectSchema as PurchaseRequestActivityCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema)]),
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInput>;
export const PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectZodSchema = makeSchema();
