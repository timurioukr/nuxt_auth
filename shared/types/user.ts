import type { z } from 'zod'
import type { dummyJsonUserProfileSchema } from '#shared/utils/user-schema'

export type UserProfile = z.infer<typeof dummyJsonUserProfileSchema>
