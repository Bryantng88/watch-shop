import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './ProjectionEventDeliveryWhereUniqueInput.schema';
import { ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUpdateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryCreateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema)]),
  create: z.union([z.lazy(() => ProjectionEventDeliveryCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedCreateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInput>;
export const ProjectionEventDeliveryUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
