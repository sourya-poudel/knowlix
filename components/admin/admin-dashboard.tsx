'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Download, Eye, Trash2, CheckCircle, XCircle, Users } from 'lucide-react'
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts'

export type AdminResource = {
  id: string
  title: string
  courseCode: string
  courseName: string
  userName: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  status: string
  createdAt: string
  userId: string
}

export type AdminStats = {
  total: number
  pending: number
  approved: number
  rejected: number
  totalUsers: number
  statusChart: Array<{ name: string; value: number }>
  trendsChart: Array<{ date: string; uploads: number }>
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  bio: string | null
  reputation: number
  createdAt: string
  uploadCount: number
}

const COLORS = ['#eab308', '#22c55e', '#ef4444']

export function AdminDashboard({ showUsers = true }: { showUsers?: boolean }) {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [resources, setResources] = useState<AdminResource[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [resourceTab, setResourceTab] = useState('pending')

  const pageSize = 10

  useEffect(() => {
    fetchStats()
    if (showUsers) {
      fetchUsers()
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources(resourceTab, 0)
      setPage(0)
    }
  }, [activeTab, resourceTab])

  useEffect(() => {
    if (showUsers) {
      fetchUsers()
    }
  }, [showUsers])

  async function fetchStats() {
    const res = await fetch('/api/admin/stats')
    if (res.ok) {
      setStats(await res.json())
    }
  }

  async function fetchUsers() {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      setUsers(await res.json())
    }
  }

  async function fetchResources(status: string, pageNum: number) {
    setLoading(true)
    const res = await fetch(
      `/api/admin/resources?status=${status}&limit=${pageSize}&offset=${pageNum * pageSize}`
    )
    if (res.ok) {
      const data = await res.json()
      setResources(data.resources)
      setTotalCount(data.total)
    } else {
      toast.error('Unable to load resources')
    }
    setLoading(false)
  }

  async function updateStatus(resourceId: string, newStatus: 'approved' | 'rejected') {
    const res = await fetch('/api/admin/resource-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, status: newStatus }),
    })

    if (!res.ok) {
      toast.error('Unable to update status')
      return
    }

    toast.success(`Resource ${newStatus}`)
    await fetchStats()
    await fetchResources(resourceTab, page)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-sm shadow-slate-950/5">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(46,120,255,0.08),rgba(38,184,181,0.08))]" />
        <div className="relative flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Moderation console
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage resources, view statistics, and moderate community submissions.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${showUsers ? 'grid-cols-3' : 'grid-cols-2'} rounded-full bg-muted/70 p-1`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {showUsers ? <TabsTrigger value="users">Users</TabsTrigger> : null}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8">
            {/* Statistics Cards */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-5">
                <Card className="rounded-[1.5rem] border-border/70 p-6 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                  <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                </Card>
                <Card className="rounded-[1.5rem] border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900 dark:bg-yellow-950">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-yellow-900 dark:text-yellow-200">
                    {stats.pending}
                  </p>
                </Card>
                <Card className="rounded-[1.5rem] border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">Approved</p>
                  <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-200">
                    {stats.approved}
                  </p>
                </Card>
                <Card className="rounded-[1.5rem] border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
                  <p className="text-sm font-medium text-red-900 dark:text-red-200">Rejected</p>
                  <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-200">
                    {stats.rejected}
                  </p>
                </Card>
                <Card className="rounded-[1.5rem] border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Total Users</p>
                  <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {stats.totalUsers}
                  </p>
                </Card>
              </div>
            )}

            {/* Charts */}
            {stats && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Status Distribution Pie Chart */}
                <Card className="rounded-[1.5rem] border-border/70 p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Resource Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.statusChart}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.statusChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Upload Trends Line Chart */}
                <Card className="rounded-[1.5rem] border-border/70 p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Upload Trends (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.trendsChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="uploads"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* RESOURCES TAB */}
          <TabsContent value="resources" className="space-y-6">
            <div className="rounded-[1.5rem] border border-border/70 bg-card/90 shadow-sm">
              <div className="border-b border-border px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/70 p-1">
                  <TabsTrigger value="pending" onClick={() => setResourceTab('pending')}>
                    Pending ({stats?.pending || 0})
                  </TabsTrigger>
                  <TabsTrigger value="approved" onClick={() => setResourceTab('approved')}>
                    Approved ({stats?.approved || 0})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" onClick={() => setResourceTab('rejected')}>
                    Rejected ({stats?.rejected || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center text-muted-foreground">Loading resources...</div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No {resourceTab} resources found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resources.map((res) => (
                      <div
                        key={res.id}
                        className="flex flex-col gap-4 rounded-[1.25rem] border border-border/70 bg-background/80 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">{res.title}</h3>
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {res.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              {res.courseCode} · {res.courseName}
                            </p>
                            <p>Uploaded by {res.userName}</p>
                            {res.fileName && <p className="font-mono text-xs">{res.fileName}</p>}
                            {res.fileSize && (
                              <p>{(res.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                            <p className="text-xs">
                              {new Date(res.createdAt).toLocaleDateString()}{' '}
                              {new Date(res.createdAt).toLocaleTimeString()}
                            </p>
                          </div>

                          {/* File Actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {res.fileUrl && (
                              <>
                                <a
                                  href={res.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                                >
                                  <Eye className="h-4 w-4" />
                                  View File
                                </a>
                                <a
                                  href={res.fileUrl}
                                  download={res.fileName}
                                  className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {resourceTab === 'pending' && (
                          <div className="flex flex-col gap-2 sm:min-w-max">
                            <Button
                              size="sm"
                              onClick={() => updateStatus(res.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(res.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {(resourceTab === 'approved' || resourceTab === 'rejected') && (
                          <div className="flex flex-col gap-2 sm:min-w-max">
                            {resourceTab === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(res.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            )}
                            {resourceTab === 'rejected' && (
                              <Button
                                size="sm"
                                onClick={() => updateStatus(res.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">
                          Page {page + 1} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => {
                              setPage(page - 1)
                              fetchResources(resourceTab, page - 1)
                            }}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => {
                              setPage(page + 1)
                              fetchResources(resourceTab, page + 1)
                            }}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* USERS TAB */}
          {showUsers ? (
            <TabsContent value="users" className="space-y-6">
            <div className="mb-4 text-sm text-muted-foreground">
              Total Users: <span className="font-semibold text-foreground">{users.length}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Card key={user.id} className="flex flex-col gap-4 rounded-[1.5rem] border-border/70 p-6 shadow-sm">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
                      "{user.bio}"
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Uploads</p>
                      <p className="font-semibold text-lg">{user.uploadCount}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Reputation</p>
                      <p className="font-semibold text-lg">{user.reputation}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>

            {users.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                No users found.
              </Card>
            )}
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  )
}
