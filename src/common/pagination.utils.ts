export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const createPaginatedResult = <T>(
  data: T[],
  total: number,
  currentPage: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    currentPage,
    totalPages,
  };
};
