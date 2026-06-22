'use client'

import * as React from 'react'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createResource } from '@/lib/resources'
import { RESOURCE_TYPES } from '@/lib/constants'

export function UploadResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('notes')
  const [courseCode, setCourseCode] = useState('')
  const [courseName, setCourseName] = useState('')
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await createResource({
        title,
        description,
        type,
        courseCode,
        courseName,
        semester,
        year: year ? Number(year) : null,
        file,
      })
      toast.success('Resource uploaded')
      onOpenChange(false)
      setTitle('')
      setDescription('')
      setType('notes')
      setCourseCode('')
      setCourseName('')
      setSemester('')
      setYear('')
      setFile(null)
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
            <Label htmlFor="resource-type">Resource type</Label>
            <Select value={type} onValueChange={(value) => setType(String(value ?? 'notes'))}>
              <SelectTrigger id="resource-type" className="w-full">
                <SelectValue placeholder="Select a resource type" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="resource-file">Attach file</Label>
            <Input
              id="resource-file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">{file.name}</div>
                <div>{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : null}
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
