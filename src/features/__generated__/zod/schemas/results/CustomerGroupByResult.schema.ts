import * as z from 'zod';
export const CustomerGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  ward: z.string(),
  city: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  address: z.string(),
<<<<<<< HEAD
=======
  district: z.string(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  _count: z.object({
    id: z.number(),
    name: z.number(),
    email: z.number(),
    phone: z.number(),
    ward: z.number(),
    city: z.number(),
    userId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    address: z.number(),
<<<<<<< HEAD
=======
    district: z.number(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
    Acquisition: z.number(),
    user: z.number(),
    Invoice: z.number(),
    orders: z.number(),
    ServiceRequest: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
<<<<<<< HEAD
    address: z.string().nullable()
=======
    address: z.string().nullable(),
    district: z.string().nullable()
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
<<<<<<< HEAD
    address: z.string().nullable()
=======
    address: z.string().nullable(),
    district: z.string().nullable()
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  }).nullable().optional()
}));