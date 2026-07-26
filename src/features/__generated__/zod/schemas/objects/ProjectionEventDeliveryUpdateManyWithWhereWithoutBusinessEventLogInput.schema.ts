import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryScalarWhereInputObjectSchema as ProjectionEventDeliveryScalarWhereInputObjectSchema } from './ProjectionEventDeliveryScalarWhereInput.schema';
import { ProjectionEventDeliveryUpdateManyMutationInputObjectSchema as ProjectionEventDeliveryUpdateManyMutationInputObjectSchema } from './ProjectionEventDeliveryUpdateManyMutationInput.schema';
import { ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema as ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema } from './ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProjectionEventDeliveryUpdateManyMutationInputObjectSchema), z.lazy(() => ProjectionEventDeliveryUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInput>;
export const ProjectionEventDeliveryUpdateManyWithWhereWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
