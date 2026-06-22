// ---------------------------------------------------------------------------
// Mock data for the student dashboard.
//
// Shapes intentionally mirror the `resource` table in lib/db/schema.ts so that
// these can be replaced with real queries later without changing the UI.
// ---------------------------------------------------------------------------

import type { ResourceType } from '@/lib/constants'

export type MockResource = {
  id: string
  title: string
  type: ResourceType
  courseCode: string
  courseName: string
  uploaderName: string
  fileUrl?: string
  fileName?: string
  fileSize: number
  fileType?: string
  upvoteCount: number
  downloadCount: number
  viewCount: number
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
  bookmarked?: boolean
}

export const CURRENT_USER = {
  name: 'Alex Carter',
  email: 'alex.carter@stanford.edu',
  institutionName: 'Stanford University',
  reputation: 1280,
  initials: 'AC',
}

export const DASHBOARD_STATS = {
  uploads: 14,
  saved: 32,
  downloads: 486,
  upvotes: 742,
}

export const MY_UPLOADS: MockResource[] = [
  {
    id: 'r1',
    title: 'Linear Algebra \u2014 Complete Midterm Notes',
    type: 'notes',
    courseCode: 'MATH 51',
    courseName: 'Linear Algebra & Multivariable Calculus',
    uploaderName: 'Alex Carter',
    fileSize: 2_400_000,
    upvoteCount: 128,
    downloadCount: 312,
    viewCount: 1240,
    status: 'approved',
    createdAt: '2026-05-28T10:00:00Z',
  },
  {
    id: 'r2',
    title: 'Operating Systems Final Cheat Sheet',
    type: 'cheatsheet',
    courseCode: 'CS 140',
    courseName: 'Operating Systems',
    uploaderName: 'Alex Carter',
    fileSize: 680_000,
    upvoteCount: 86,
    downloadCount: 198,
    viewCount: 745,
    status: 'approved',
    createdAt: '2026-06-02T14:30:00Z',
  },
  {
    id: 'r3',
    title: 'Thermodynamics Problem Set Solutions',
    type: 'problemset',
    courseCode: 'ME 70',
    courseName: 'Introductory Fluids Engineering',
    uploaderName: 'Alex Carter',
    fileSize: 1_100_000,
    upvoteCount: 12,
    downloadCount: 24,
    viewCount: 92,
    status: 'pending',
    createdAt: '2026-06-17T09:15:00Z',
  },
]

export const SAVED_RESOURCES: MockResource[] = [
  {
    id: 's1',
    title: 'Organic Chemistry Reaction Map',
    type: 'summary',
    courseCode: 'CHEM 33',
    courseName: 'Structure & Reactivity',
    uploaderName: 'Priya Nair',
    fileSize: 3_200_000,
    upvoteCount: 264,
    downloadCount: 902,
    viewCount: 3400,
    status: 'approved',
    createdAt: '2026-04-11T08:00:00Z',
  },
  {
    id: 's2',
    title: 'Microeconomics Past Final (2025)',
    type: 'exam',
    courseCode: 'ECON 50',
    courseName: 'Economic Analysis I',
    uploaderName: 'Daniel Osei',
    fileSize: 540_000,
    upvoteCount: 173,
    downloadCount: 611,
    viewCount: 2100,
    status: 'approved',
    createdAt: '2026-03-22T16:45:00Z',
  },
  {
    id: 's3',
    title: 'Data Structures Lecture Slides',
    type: 'slides',
    courseCode: 'CS 106B',
    courseName: 'Programming Abstractions',
    uploaderName: 'Mei Lin',
    fileSize: 5_800_000,
    upvoteCount: 209,
    downloadCount: 540,
    viewCount: 1980,
    status: 'approved',
    createdAt: '2026-05-05T11:20:00Z',
  },
]

export const RECENT_RESOURCES: MockResource[] = [
  {
    id: 'n1',
    title: 'Algorithms \u2014 Dynamic Programming Guide',
    type: 'summary',
    courseCode: 'CS 161',
    courseName: 'Design & Analysis of Algorithms',
    uploaderName: 'Jordan Reyes',
    fileSize: 1_900_000,
    upvoteCount: 54,
    downloadCount: 132,
    viewCount: 610,
    status: 'approved',
    createdAt: '2026-06-19T07:30:00Z',
  },
  {
    id: 'n2',
    title: 'Probability Theory Formula Sheet',
    type: 'cheatsheet',
    courseCode: 'STATS 116',
    courseName: 'Theory of Probability',
    uploaderName: 'Sara Khan',
    fileSize: 420_000,
    upvoteCount: 41,
    downloadCount: 97,
    viewCount: 388,
    status: 'approved',
    createdAt: '2026-06-18T19:05:00Z',
  },
  {
    id: 'n3',
    title: 'Modern Physics Midterm Review',
    type: 'notes',
    courseCode: 'PHYSICS 43',
    courseName: 'Electricity & Magnetism',
    uploaderName: 'Tom Becker',
    fileSize: 2_750_000,
    upvoteCount: 33,
    downloadCount: 71,
    viewCount: 295,
    status: 'approved',
    createdAt: '2026-06-18T12:40:00Z',
  },
  {
    id: 'n4',
    title: 'Intro to Psychology Study Guide',
    type: 'summary',
    courseCode: 'PSYCH 1',
    courseName: 'Introduction to Psychology',
    uploaderName: 'Lena Fischer',
    fileSize: 1_300_000,
    upvoteCount: 28,
    downloadCount: 64,
    viewCount: 240,
    status: 'approved',
    createdAt: '2026-06-17T22:10:00Z',
  },
]
