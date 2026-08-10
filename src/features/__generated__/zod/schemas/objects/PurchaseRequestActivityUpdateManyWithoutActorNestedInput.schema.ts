import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityCreateWithoutActorInputObjectSchema as PurchaseRequestActivityCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateWithoutActorInput.schema';
import { PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema as PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema } from './PurchaseRequestActivityUncheckedCreateWithoutActorInput.schema';
import { PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema as PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema } from './PurchaseRequestActivityCreateOrConnectWithoutActorInput.schema';
import { PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema as PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema } from './PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInput.schema';
import { PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema as PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema } from './PurchaseRequestActivityCreateManyActorInputEnvelope.schema';
import { PurchaseRequestActivityWhereUniqueInputObjectSchema as PurchaseRequestActivityWhereUniqueInputObjectSchema } from './PurchaseRequestActivityWhereUniqueInput.schema';
import { PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema as PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema } from './PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInput.schema';
import { PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectSchema as PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectSchema } from './PurchaseRequestActivityUpdateManyWithWhereWithoutActorInput.schema';
import { PurchaseRequestActivityScalarWhereInputObjectSchema as PurchaseRequestActivityScalarWhereInputObjectSchema } from './PurchaseRequestActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateWithoutActorInputObjectSchema).array(), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedCreateWithoutActorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityCreateOrConnectWithoutActorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpsertWithWhereUniqueWithoutActorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PurchaseRequestActivityCreateManyActorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema), z.lazy(() => PurchaseRequestActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpdateWithWhereUniqueWithoutActorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectSchema), z.lazy(() => PurchaseRequestActivityUpdateManyWithWhereWithoutActorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema), z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PurchaseRequestActivityUpdateManyWithoutActorNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithoutActorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithoutActorNestedInput>;
export const PurchaseRequestActivityUpdateManyWithoutActorNestedInputObjectZodSchema = makeSchema();
