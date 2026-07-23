import { describe, expect, it } from 'vitest'
import {
  REMEMBER_TTL_MINUTES,
  pickUserProfile,
  sessionCookieOptions
} from './auth-session'
import { dummyJsonLoginResponseSchema } from '#shared/utils/user-schema'

const validDummyJsonUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://example.com/emily.png',
  phone: '+1 555 0100',
  birthDate: '1996-5-30',
  address: {
    city: 'Phoenix',
    country: 'United States',
    address: 'Sensitive street address'
  },
  bank: {
    cardNumber: 'Sensitive card number'
  }
}

describe('session policy', () => {
  it('limits remembered sessions to seven days', () => {
    expect(REMEMBER_TTL_MINUTES).toBe(60 * 24 * 7)
  })

  it('uses a secure persistent cookie in production', () => {
    expect(sessionCookieOptions(true, false)).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  })
})

describe('pickUserProfile', () => {
  it('rejects malformed DummyJSON users at runtime', () => {
    expect(() => pickUserProfile({
      ...validDummyJsonUser,
      id: 'not-a-number'
    })).toThrow()
  })

  it.each([
    ['id', 0],
    ['username', '   '],
    ['email', 'not-an-email'],
    ['gender', 'other'],
    ['image', 'not-a-url'],
    ['birthDate', '30/05/1996']
  ])('rejects an invalid %s', (field, value) => {
    expect(() => pickUserProfile({
      ...validDummyJsonUser,
      [field]: value
    })).toThrow()
  })

  it('returns only the whitelisted flattened profile fields', () => {
    expect(pickUserProfile(validDummyJsonUser)).toEqual({
      id: 1,
      username: 'emilys',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://example.com/emily.png',
      phone: '+1 555 0100',
      birthDate: '1996-5-30',
      city: 'Phoenix',
      country: 'United States'
    })
  })

  it('rejects profile images served over an insecure protocol', () => {
    expect(() => pickUserProfile({
      ...validDummyJsonUser,
      image: 'http://example.com/emily.png'
    })).toThrow()
  })
})

describe('dummyJsonLoginResponseSchema', () => {
  it('rejects blank access tokens', () => {
    expect(dummyJsonLoginResponseSchema.safeParse({
      accessToken: '   '
    }).success).toBe(false)
  })
})
