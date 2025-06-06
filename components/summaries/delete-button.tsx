'use client'

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from 'react';
import { deleteSummary } from '@/actions/summary-actions';
import { toast } from 'sonner';

interface DeleteButtonProps {
  summaryId: string;
}

export default function DeleteButton({ summaryId }: DeleteButtonProps) {

  const handleDelete = async () => {
    //Delete Summary
    startTransition(async () => {
      const result = await deleteSummary({ summaryId });
      if (!result.success) {
        toast.error("Failed to delete Summary")
      }
      setopen(false);
    })

  }

  const [open, setopen] = useState(false)
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size="icon"
          className="text-cyan-600 !bg-cyan-50 border border-cyan-200 hover:text-cyan-800 hover:!bg-cyan-100"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-teal-700">Delete Summary</DialogTitle>
          <DialogDescription className="text-teal-600">
            Are you sure you want to delete summary? This action can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setopen(false)}
            variant="ghost"
            className="
              !bg-cyan-50 border 
              border-cyan-200 
              hover:text-cyan-800 
              hover:!bg-cyan-100
            "
          >
            Cancel
          </Button>

          <Button onClick={handleDelete}
            variant="destructive"
            className="
              !bg-teal-900 
              hover:!bg-teal-700
            "
          >
            {isPending ? 'Deleting...' : 'Delete'} 
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>

  );
}
