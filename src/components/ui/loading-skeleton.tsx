import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

// Specialized skeleton components for common patterns
export function CardSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
      <Skeleton className='h-20 w-full' />
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[160px]' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className='space-y-3'>
      <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: rows * columns }).map((_, i) => (
          <Skeleton key={i} className='h-4 w-full' />
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
