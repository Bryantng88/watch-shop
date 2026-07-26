import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema as ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema } from './ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelope.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './ProjectionEventDeliveryWhereUniqueInput.schema';
import { ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryScalarWhereInputObjectSchema as ProjectionEventDeliveryScalarWhereInputObjectSchema } from './ProjectionEventDeliveryScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema).array(), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema), z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema), z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema), z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema), z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema), z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogNestedInput>;
export const ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectZodSchema = makeSchema();
