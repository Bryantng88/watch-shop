import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema';
import { WorkCaseCategoryArgsObjectSchema as WorkCaseCategoryArgsObjectSchema } from './WorkCaseCategoryArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { WorkCaseActivityFindManySchema as WorkCaseActivityFindManySchema } from '../findManyWorkCaseActivity.schema';
import { WorkCaseCountOutputTypeArgsObjectSchema as WorkCaseCountOutputTypeArgsObjectSchema } from './WorkCaseCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional(),
  category: z.union([z.boolean(), z.lazy(() => WorkCaseCategoryArgsObjectSchema)]).optional(),
  raisedByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  serviceRequests: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  activities: z.union([z.boolean(), z.lazy(() => WorkCaseActivityFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WorkCaseCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseIncludeObjectSchema: z.ZodType<Prisma.WorkCaseInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseInclude>;
export const WorkCaseIncludeObjectZodSchema = makeSchema();
