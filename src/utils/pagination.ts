interface GetDatePaginateInfoOption {
  limit: number;
  docCount: number;
}

const getNextDataPaginateInfo = (
  page: number | undefined,
  { docCount, limit }: GetDatePaginateInfoOption
) => {
  let totalPage = Math.ceil(docCount / limit);
  if (page === 0 || typeof page === "undefined") page = 1;

  const nextPage = page >= totalPage ? null : page + 1;
  const prevPage = page === 1 ? null : page - 1;
  return {
    next: nextPage,
    current: page,
    prev: prevPage,
    totalPage: totalPage,
    totalItemCount: docCount,
  };
};

export const DEFAULT_QUERY_LIMIT = 20;

type DatePaginateOption = {
  page: number | undefined;
  docCount: number;
  limit: number;
};

function includeDataPaginateRoute<T>(
  data: T,
  { page, limit, docCount }: DatePaginateOption
) {
  page = page ? +page : 1;
  limit = limit ? +limit : DEFAULT_QUERY_LIMIT;

  return {
    page: getNextDataPaginateInfo(page, { docCount, limit }),
    data,
  };
}

export { getNextDataPaginateInfo, includeDataPaginateRoute };
