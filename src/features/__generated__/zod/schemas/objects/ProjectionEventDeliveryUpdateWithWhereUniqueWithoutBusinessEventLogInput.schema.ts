import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './ProjectionEventDeliveryWhereUniqueInput.schema';
import { ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUpdateWithoutBusinessEventLogInput.schema';
import { ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProjectionEventDeliveryWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProjectionEventDeliveryUpdateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedUpdateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInput>;
export const ProjectionEventDeliveryUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
