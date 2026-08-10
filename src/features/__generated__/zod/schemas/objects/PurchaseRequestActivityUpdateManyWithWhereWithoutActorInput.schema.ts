import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityScalarWhereInputObjectSchema as PurchaseRequestActivityScalarWhereInputObjectSchema } from './PurchaseRequestActivityScalarWhereInput.schema';
import { PurchaseRequestActivityUpdateManyMutationInputObjectSchema as PurchaseRequestActivityUpdateManyMutationInputObjectSchema } from './PurchaseRequestActivityUpdateManyMutationInput.schema';
import { PurchaseRequestActivityUncheckedUpdateManyWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedUpdateManyWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateManyWithoutActorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestActivityUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateManyWithoutActorInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithWhereWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithWhereWithoutActorInput>;
export const PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectZodSchema = makeSchema();
