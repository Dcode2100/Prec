import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number, newLimit?: number) => void;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 20,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);

  const onPageChange = useCallback((page: number, newLimit?: number) => {
    setCurrentPage(page);
    if (newLimit) {
      setItemsPerPage(newLimit);
    }
  }, []);

  return {
    currentPage,
    itemsPerPage,
    onPageChange,
  };
}