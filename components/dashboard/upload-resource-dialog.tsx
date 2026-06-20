'use client'

import * as React from 'react'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createResource } from '@/lib/resources'

export function UploadResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [courseName, setCourseName] = useState('')
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await createResource({
        title,
        description,
        type: 'notes',
        courseCode,
        courseName,
        semester,
        year: year ? Number(year) : null,
      })
      toast.success('Resource uploaded')
      onOpenChange(false)
      setTitle('')
      setDescription('')
      setCourseCode('')
      setCourseName('')
      setSemester('')
      setYear('')
    } catch (error) {
      toast.error('Unable to upload resource')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload a resource</DialogTitle>
          <DialogDescription>
            Share your coursework with your campus by uploading notes or study material.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="resource-title">Title</Label>
            <Input
              id="resource-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Lecture notes, summary, or cheat sheet"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resource-description">Description</Label>
            <Textarea
              id="resource-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description of what this resource covers"
              rows={4}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="course-code">Course code</Label>
              <Input
                id="course-code"
                value={courseCode}
                onChange={(event) => setCourseCode(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-name">Course name</Label>
              <Input
                id="course-name"
                value={courseName}
                onChange={(event) => setCourseName(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <Upload className="mr-2 h-4 w-4" />
              {submitting ? 'Uploading...' : 'Upload resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
