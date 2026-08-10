import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateWithoutActorInputObjectSchema as PurchaseRequestActivityCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutActorInput.schema';
import { PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema as PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateOrConnectWithoutActorInput.schema';
import { PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema as PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema } from './PurchaseRequestActivityCreateManyActorInputEnvelope.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema).array(), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestActivityCreateNestedManyWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateNestedManyWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateNestedManyWithoutActorInput>;
export const PurchaseRequestActivityCreateNestedManyWithoutActorInputObjectZodSchema = makeSchema();
