import { z } from 'zod'

export const dummyJsonLoginResponseSchema = z.object({
  accessToken: z.string().trim().min(1)
})

export const dummyJsonUserProfileSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().trim().min(1),
  email: z.email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  gender: z.enum(['female', 'male']),
  image: z.url().refine(url => new URL(url).protocol === 'https:', {
    message: 'Profile image must use HTTPS'
  }),
  phone: z.string().trim().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/),
  address: z.object({
    city: z.string().trim().optional(),
    country: z.string().trim().optional()
  }).optional()
}).transform(user => ({
  id: user.id,
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  gender: user.gender,
  image: user.image,
  phone: user.phone,
  birthDate: user.birthDate,
  city: user.address?.city ?? '',
  country: user.address?.country ?? ''
}))
