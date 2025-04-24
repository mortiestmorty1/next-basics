'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationNumber
            key={page}
            href={createPageURL(page)}
            page={page}
            isActive={currentPage === page}
          />
        ))}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  const className = isActive
    ? 'flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-gray-600'
    : 'flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100';

  return isActive ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = isDisabled
    ? 'flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-gray-300'
    : 'flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100';

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
