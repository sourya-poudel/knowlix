import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// Better Auth tables (camelCase column names must match Better Auth defaults)
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  institutionId: text('institutionId'),
  role: text('role').notNull().default('student'),
  bio: text('bio'),
  reputation: integer('reputation').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Knowlix application tables (plain userId columns, no FK by convention)
// ---------------------------------------------------------------------------

export const institution = pgTable('institution', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull(),
  logo: text('logo'),
  memberCount: integer('memberCount').notNull().default(0),
  resourceCount: integer('resourceCount').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const resource = pgTable('resource', {
  id: text('id').primaryKey(),
  institutionId: text('institutionId').notNull(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull().default('notes'),
  courseCode: text('courseCode'),
  courseName: text('courseName'),
  professor: text('professor'),
  semester: text('semester'),
  year: integer('year'),
  fileUrl: text('fileUrl'),
  fileName: text('fileName'),
  fileSize: integer('fileSize'),
  fileType: text('fileType'),
  tags: text('tags').array().notNull().default([]),
  status: text('status').notNull().default('pending'),
  rejectionReason: text('rejectionReason'),
  moderatedBy: text('moderatedBy'),
  moderatedAt: timestamp('moderatedAt'),
  viewCount: integer('viewCount').notNull().default(0),
  downloadCount: integer('downloadCount').notNull().default(0),
  upvoteCount: integer('upvoteCount').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const vote = pgTable(
  'vote',
  {
    id: text('id').primaryKey(),
    resourceId: text('resourceId').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => ({ uniq: unique().on(t.resourceId, t.userId) }),
)

export const bookmark = pgTable(
  'bookmark',
  {
    id: text('id').primaryKey(),
    resourceId: text('resourceId').notNull(),
    userId: text('userId').notNull(),
    collectionId: text('collectionId'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => ({ uniq: unique().on(t.resourceId, t.userId) }),
)

export const collection = pgTable('collection', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('isPublic').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const comment = pgTable('comment', {
  id: text('id').primaryKey(),
  resourceId: text('resourceId').notNull(),
  userId: text('userId').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const request = pgTable('request', {
  id: text('id').primaryKey(),
  institutionId: text('institutionId').notNull(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  courseCode: text('courseCode'),
  status: text('status').notNull().default('open'),
  upvoteCount: integer('upvoteCount').notNull().default(0),
  fulfilledResourceId: text('fulfilledResourceId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const requestVote = pgTable(
  'request_vote',
  {
    id: text('id').primaryKey(),
    requestId: text('requestId').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => ({ uniq: unique().on(t.requestId, t.userId) }),
)

export const notification = pgTable('notification', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  linkUrl: text('linkUrl'),
  isRead: boolean('isRead').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const report = pgTable('report', {
  id: text('id').primaryKey(),
  resourceId: text('resourceId').notNull(),
  userId: text('userId').notNull(),
  reason: text('reason').notNull(),
  details: text('details'),
  status: text('status').notNull().default('open'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
