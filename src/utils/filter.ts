// /**
//  * @author Idris Adeniji (alvacoder)
//  * @email idrisadeniji01@gmail.com
//  * @create date 2021-11-19 09:32:43
//  */
// export const simpleList = async (schemaName, filter, populateOptions) => {
//     let populateString = "",
//       buildQuery,
//       data;
//     if (populateOptions.length > 0) {
//       populateOptions.forEach((option) => {
//         populateString += `populate('${option}')`;
//       });
//     }
//     buildQuery = `${schemaName}.find(filter).${populateString}`;
//     data = await buildQuery;
//     console.log(data);
//   };

//   export const create = async (schemaName, data) => {
//     let newData = new schemaName(data);
//     newData = await newData.save();
//     return newData;
//   };

//   export const isUnique = async (schemaName, uniqueField) => {
//     const data = await schemaName.findOne(uniqueField);
//     if (!data) return true;
//     return false;
//   };

//   export const countItems = async (schemaName, filter) => {
//     let count;
//     count = await schemaName.find(filter).countDocuments();
//     return count;
//   };

//   export const fetch = async (schemaName, filter = {}, page = 1, limit = 0, populateOptions = [], sortOptions ={createdAt: 'desc'}) => {
//     let populateField = populateOptions.toString();
//     let [data, dataCount] = await Promise.all([
//       schemaName.find(filter).populate(`${populateField}`).sort(sortOptions).skip((page - 1) * limit).limit(limit).lean(),
//       schemaName.find(filter).populate(`${populateField}`).sort(sortOptions).countDocuments()
//     ])
//     data = {data, paging: {
//       totalCount: dataCount,
//       totalPages: limit === 0 ? 1 : Math.ceil(dataCount / limit),
//       currentPage: page
//     }}
//     return data;
//   };

//   export const unsortedFetch = async (schemaName, filter = {}, page = 1, limit = 0, populateOptions = []) => {
//     let populateField = populateOptions.toString();
//     let [data, dataCount] = await Promise.all([
//       schemaName.find(filter).populate(`${populateField}`).skip((page - 1) * limit).limit(limit).lean(),
//       schemaName.find(filter).populate(`${populateField}`).countDocuments()
//     ])
//     data = {data, paging: {
//       totalCount: dataCount,
//       totalPages: limit === 0 ? 1 : Math.ceil(dataCount / limit),
//       currentPage: page
//     }}
//     return data;
//   };

//   export const fetchOne = async (schemaName, filter, populateOptions = []) => {
//     let populateField = populateOptions.toString();
//     let data = await schemaName.findOne(filter).populate(`${populateField}`);
//     return data;
//   };

//   export const update = async (schemaName, filter, data, populateOptions = []) => {
//     let populateField = populateOptions.toString();
//     let updatedData = await schemaName
//       .findOneAndUpdate(filter, data, {
//         new: true,
//         upsert: true,
//         omitUndefined: true,
//         setDefaultsOnInsert: false,
//       })
//       .populate(`${populateField}`).lean();
//     return updatedData;
//   };

//   export const deleteItem = async (schemaName, filter) => {
//     let item = await schemaName.findOneAndDelete(filter);
//     return item;
//   };

//   export const rawQuery = async (query) => {
//     let data = await query;
//     return data;
//   }
