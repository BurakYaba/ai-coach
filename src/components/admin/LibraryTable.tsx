'use client';

import { format } from 'date-fns';
import { Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { formatDuration } from '@/lib/utils';

interface LibraryItem {
  _id: string;
  title: string;
  level: string;
  topic: string;
  contentType: string;
  duration: number;
  isPublic: boolean;
  category?: string;
  tags?: string[];
  createdAt: string;
}

interface LibraryTableProps {
  filter: 'all' | 'published' | 'drafts';
}

export function LibraryTable({ filter }: LibraryTableProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchLibraryItems = async () => {
    setLoading(true);
    try {
      let url = `/api/library?page=${currentPage}&limit=10`;

      if (filter === 'published') {
        url += '&isPublic=true';
      } else if (filter === 'drafts') {
        url += '&isPublic=false';
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch library items');
      }

      const data = await response.json();
      setItems(data.sessions);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error('Error fetching library items:', err);
      setError('Failed to load library items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryItems();
  }, [currentPage, filter, searchTerm]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/library/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove item from state
      setItems(items.filter(item => item._id !== id));
      toast({
        title: 'Item deleted',
        description: 'Library item has been deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting item:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete library item',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteItemId(null);
      setIsDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteItemId(id);
    setIsDialogOpen(true);
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by title or topic..."
          className="max-w-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  No library items found
                </TableCell>
              </TableRow>
            ) : (
              items.map(item => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.level}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.topic.length > 20
                      ? `${item.topic.substring(0, 20)}...`
                      : item.topic}
                  </TableCell>
                  <TableCell>{item.contentType}</TableCell>
                  <TableCell>{formatDuration(item.duration)}</TableCell>
                  <TableCell>
                    <Badge variant={item.isPublic ? 'default' : 'outline'}>
                      {item.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/library/${item._id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/library/${item._id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(item._id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this library item? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteItemId && handleDelete(deleteItemId)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
