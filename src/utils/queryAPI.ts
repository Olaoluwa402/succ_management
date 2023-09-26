export default class APIQuery<T> {
  public Query: any;
  public QueryString: any;

  constructor(Query: T, QueryString: any) {
    this.Query = Query;
    this.QueryString = QueryString;
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
    this.Query = this.Query.skip(skip).limit(limit);

    return this;
  }
}
