import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema as ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema } from './ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelope.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './ProjectionEventDeliveryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema).array(), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProjectionEventDeliveryCreateManyBusinessEventLogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema), z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProjectionEventDeliveryCreateNestedManyWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateNestedManyWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateNestedManyWithoutBusinessEventLogInput>;
export const ProjectionEventDeliveryCreateNestedManyWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
