import { Schema, Document, Model } from "mongoose";

export interface FetchResult<T> {
  data: any;
  paging: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export const fetchQuery = async <T extends Document>(
  schemaName: Model<T>,
  filter = {},
  page = 1,
  limit = 0,
  populateOptions: string[] = [],
  sortOptions: Record<string, "asc" | "desc"> = { createdAt: "desc" }
): Promise<FetchResult<T>> => {
  const populateField = populateOptions.join(" ");

  const [data, dataCount] = await Promise.all([
    schemaName
      .find(filter)
      .populate(populateField)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    schemaName.find(filter).populate(populateField).countDocuments(),
  ]);

  const result: FetchResult<T> = {
    data,
    paging: {
      totalCount: dataCount,
      totalPages: limit === 0 ? 1 : Math.ceil(dataCount / limit),
      currentPage: page,
    },
  };

  return result;
};

export const countItems = async (
  schemaName: Model<any>,
  filter: Record<string, any>
): Promise<number> => {
  let count;
  count = await schemaName.find(filter).countDocuments();
  return count;
};

export const fetchOneQuery = async <T extends Document>(
  schemaName: Model<T>,
  filter: Record<string, any>,
  populateOptions: string[] = []
) => {
  const populateField = populateOptions.join(" ");
  const data = await schemaName.findOne(filter).populate(populateField);
  return data;
};

export const updateQuery = async <T extends Document>(
  schemaName: Model<T>,
  filter: Record<string, any>,
  data: Record<string, any>,
  populateOptions: string[] = []
) => {
  const populateField = populateOptions.join(" ");
  const updatedData = await schemaName
    .findOneAndUpdate(filter, data, {
      new: true,
      upsert: true,
      omitUndefined: true,
      setDefaultsOnInsert: false,
    })
    .populate(populateField)
    .lean();
  return updatedData;
};

export interface UnsortedFetchResult<T> {
  data: any;
  paging: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export const unsortedFetch = async <T extends Document>(
  schemaName: Model<T>,
  filter: Record<string, any> = {},
  page: number = 1,
  limit: number = 0,
  populateOptions: string[] = []
): Promise<UnsortedFetchResult<T>> => {
  const populateField = populateOptions.join(" ");

  const [data, dataCount] = await Promise.all([
    schemaName
      .find(filter)
      .populate(populateField)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    schemaName.find(filter).populate(populateField).countDocuments(),
  ]);

  const result: UnsortedFetchResult<T> = {
    data,
    paging: {
      totalCount: dataCount,
      totalPages: limit === 0 ? 1 : Math.ceil(dataCount / limit),
      currentPage: page,
    },
  };

  return result;
};

export const createQuery = async <T extends Document>(
  schemaName: Model<T>,
  data: Record<string, any>
): Promise<T> => {
  let newData = new schemaName(data);
  newData = await newData.save();
  return newData;
};
