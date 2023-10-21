export interface QueryResult<T> {
  data: any;
  paging: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export default class APIQuery<T> {
  public Query: any;
  public QueryString: any;
  public QueryResponse: QueryResult<T> | null = null;

  constructor(Query: T, QueryString: any) {
    this.Query = Query;
    this.QueryString = QueryString;
    this.QueryResponse = null;
  }

  Filter() {
    const queryObj: Record<string, any> = { ...this.QueryString };
    const excludeFields: string[] = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // PARSE AND REPLACE QUERY FOR SEARCH IN DATABASE
    const queryStr = JSON.stringify(queryObj);

    // SEARCH OR QUERY(IF FOUND) IN DATABASE
    this.Query = this.Query.find(JSON.parse(queryStr));
    return this;
  }

  Sort() {
    if (this.QueryString.sort) {
      const sortby = this.QueryString.sort.split(",").join(" ");
      this.Query = this.Query.sort(sortby);
    } else {
      this.Query = this.Query.sort("-createdAt");
    }
    return this;
  }

  Fields() {
    if (this.QueryString.fields) {
      const fields = this.QueryString.fields.split(",").join(" ");
      this.Query = this.Query.select(fields);
    } else {
      this.Query = this.Query.select("-__v");
    }
    return this;
  }

  Pagination() {
    const page = this.QueryString.page * 1 || 1;
    const limit = this.QueryString.limit * 1 || 2;
    const skip = (page - 1) * limit;

    // IMPLEMENTING PAGINATION
    //this.Query = this.Query.skip(skip).limit(limit);
    const dataCount = this.Query.countDocuments();
    const totalPage = limit === 0 ? 1 : Math.ceil(dataCount / limit);

    const nextPage = page >= totalPage ? null : page + 1;
    const prevPage = page === 1 ? null : page - 1;

    this.Query = this.Query.skip(skip).limit(limit);

    this.QueryResponse = {
      paging: {
        totalCount: dataCount,
        totalPages: totalPage,
        currentPage: page,
        nextPage,
        prevPage,
      },
      data: this.Query,
    };

    return this;
  }
}
