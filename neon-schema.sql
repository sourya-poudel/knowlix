-- Better Auth tables
-- These names and camelCase columns must match Better Auth defaults.

CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  image text,
  "institutionId" text,
  role text NOT NULL DEFAULT 'student',
  bio text,
  reputation integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE session (
  id text PRIMARY KEY,
  "expiresAt" timestamp NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE account (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  scope text,
  password text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- Application tables

CREATE TABLE institution (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text NOT NULL,
  logo text,
  "memberCount" integer NOT NULL DEFAULT 0,
  "resourceCount" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE resource (
  id text PRIMARY KEY,
  "institutionId" text NOT NULL,
  "userId" text NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'notes',
  "courseCode" text,
  "courseName" text,
  professor text,
  semester text,
  year integer,
  "fileUrl" text,
  "fileName" text,
  "fileSize" integer,
  "fileType" text,
  tags text[],
  status text NOT NULL DEFAULT 'pending',
  "rejectionReason" text,
  "moderatedBy" text,
  "moderatedAt" timestamp,
  "viewCount" integer NOT NULL DEFAULT 0,
  "downloadCount" integer NOT NULL DEFAULT 0,
  "upvoteCount" integer NOT NULL DEFAULT 0,
  "ratingAvg" real NOT NULL DEFAULT 0,
  "ratingCount" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE rating (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  value integer NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX rating_resource_user_idx ON rating ("resourceId", "userId");

CREATE TABLE vote (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX vote_resource_user_idx ON vote ("resourceId", "userId");

CREATE TABLE bookmark (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  "collectionId" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX bookmark_resource_user_idx ON bookmark ("resourceId", "userId");

CREATE TABLE collection (
  id text PRIMARY KEY,
  "userId" text NOT NULL,
  name text NOT NULL,
  description text,
  "isPublic" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE comment (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  "parentId" text,
  body text NOT NULL,
  "isDeleted" boolean NOT NULL DEFAULT false,
  "isHidden" boolean NOT NULL DEFAULT false,
  "helpfulCount" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE request (
  id text PRIMARY KEY,
  "institutionId" text NOT NULL,
  "userId" text NOT NULL,
  title text NOT NULL,
  description text,
  "courseCode" text,
  status text NOT NULL DEFAULT 'open',
  "upvoteCount" integer NOT NULL DEFAULT 0,
  "fulfilledResourceId" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE request_vote (
  id text PRIMARY KEY,
  "requestId" text NOT NULL,
  "userId" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX request_vote_request_user_idx ON request_vote ("requestId", "userId");

CREATE TABLE notification (
  id text PRIMARY KEY,
  "userId" text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  "linkUrl" text,
  "isRead" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE report (
  id text PRIMARY KEY,
  "resourceId" text NOT NULL,
  "userId" text NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  "createdAt" timestamp NOT NULL DEFAULT now()
);
