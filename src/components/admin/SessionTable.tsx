'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserInfo {
  name: string;
  email: string;
}

interface Session {
  _id: string;
  title: string;
  level: string;
  topic: string;
  contentType: string;
  duration: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  userId: string;
  isLibrary: boolean;
  isPublic: boolean;
  user: UserInfo;
}

interface SessionTableProps {
  filter: 'all' | 'completed' | 'inProgress' | 'library';
}

export function SessionTable({ filter }: SessionTableProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/sessions?page=${currentPage}&limit=10`;

      if (filter === 'completed') {
        url += '&isCompleted=true';
      } else if (filter === 'inProgress') {
        url += '&isCompleted=false';
      } else if (filter === 'library') {
        url += '&isLibrary=true';
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      if (levelFilter) {
        url += `&level=${encodeURIComponent(levelFilter)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentPage, filter, searchTerm, levelFilter]);

  if (loading && sessions.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by title or topic..."
          className="max-w-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
            <SelectItem value="C2">C2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No sessions found
                </TableCell>
              </TableRow>
            ) : (
              sessions.map(session => (
                <TableRow key={session._id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.level}</Badge>
                  </TableCell>
                  <TableCell>{session.contentType}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(session.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={session.isCompleted ? 'default' : 'secondary'}
                    >
                      {session.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={session.isLibrary ? 'default' : 'outline'}>
                      {session.isLibrary ? 'Library' : 'Generated'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/sessions/${session._id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
