import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithoutActorInputObjectSchema as PurchaseRequestActivityUpdateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUpdateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateWithoutActorInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInput>;
export const PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectZodSchema = makeSchema();
