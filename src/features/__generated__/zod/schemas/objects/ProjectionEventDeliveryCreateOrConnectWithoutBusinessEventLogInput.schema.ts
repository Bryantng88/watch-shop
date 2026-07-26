import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './ProjectionEventDeliveryWhereUniqueInput.schema';
import { ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInput>;
export const ProjectionEventDeliveryCreateOrConnectWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
