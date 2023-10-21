import { ICreateCriticalRole } from "./criticalRole.interface";

import CriticalRole from "./criticalRole.model";
import Talent from "../talent/talent.model";
import { IUpdateCriticalRoles } from "./criticalRole.interface";
import { subDays } from "date-fns";
import {
  fetchQuery,
  fetchOneQuery,
  updateQuery,
  createQuery,
} from "../../utils";
import { BadRequestError, NotFoundError } from "../../errors";
import APIQuery from "../../utils/queryAPI";

class CriticalRoleService {
  constructor() {}

  async createCriticalRole(companyId: string, data: ICreateCriticalRole) {
    //duplicate critical job role within same organization should not exist, check if job role with same name is already created
    const exist = await fetchOneQuery(CriticalRole, {
      "jobRole.name": data.jobRole.name,
      companyId: companyId,
    });

    if (exist) {
      throw new BadRequestError("Job role already exist for the organization");
    }
    const result = await createQuery(CriticalRole, data);

    return result;
  }

  async getCriticalRoles(companyId: string, query: any) {
    //get all role in an organization
    let recent = query.recent;
    const recentDate = recent
      ? subDays(new Date(), parseInt(recent) + 1)
      : new Date("1980-01-01");

    const fetchData = new APIQuery(
      CriticalRole.find({
        companyId,
        createdAt: { $gt: new Date(recentDate) },
        isDeleted: false,
      }).populate("successors"),
      query
    )
      .Filter()
      .Fields()
      .Pagination();

    const criticalRoles = await fetchData.Query;
    return criticalRoles;

    // let criticalRoles;
    // const page = parseInt(query.page) || 1;
    // const limit = parseInt(query.limit) || 0;
    // const jobRoleName = query.jobRoleName || "",
    //   department = query.department || "",
    //   search = query.search || "",
    //   recent = query.recent;

    // const recentDate = subDays(new Date(), parseInt(recent) + 1);

    // criticalRoles = await fetchQuery(
    //   CriticalRole,
    //   {
    //     companyId,
    //     isDeleted: false,
    //   },
    //   page,
    //   limit
    // );

    // if (recent) {
    //   criticalRoles = await fetchQuery(
    //     CriticalRole,
    //     {
    //       companyId,
    //       createdAt: { $gt: new Date(recentDate) },
    //       isDeleted: false,
    //     },
    //     page,
    //     limit
    //   );
    // }

    // if (jobRoleName) {
    //   criticalRoles = await fetchQuery(
    //     CriticalRole,
    //     {
    //       companyId,
    //       "jobRole.name": { $regex: jobRoleName, $options: "i" },
    //       isDeleted: false,
    //     },
    //     page,
    //     limit
    //   );
    // }
    // if (search) {
    //   criticalRoles = await fetchQuery(
    //     CriticalRole,
    //     {
    //       companyId,
    //       isDeleted: false,
    //       $or: [
    //         { "jobRole.name": { $regex: search, $options: "i" } },
    //         { department: { $regex: search, $options: "i" } },
    //       ],
    //     },
    //     page,
    //     limit
    //   );
    // }

    // if (department) {
    //   criticalRoles = await fetchQuery(
    //     CriticalRole,
    //     {
    //       companyId,
    //       isDeleted: false,
    //       department: { $regex: department, $options: "i" },
    //     },
    //     page,
    //     limit
    //   );

    //   return criticalRoles;
    // }
  }

  async getCriticalRole(criticalRoleId: string, companyId: any) {
    const role = await fetchOneQuery(CriticalRole, {
      _id: criticalRoleId,
      companyId: companyId,
    });

    return role;
  }

  async getAnalytics(companyId: any, query: any) {
    try {
      const matchQuery = { $match: { companyId: companyId } };

      const totalAggregate = await CriticalRole.aggregate([
        matchQuery,
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            count: 1,
            totalSucessors: {
              $cond: [
                {
                  $and: [
                    { $isArray: "$sucessors" },
                    { $ne: [{ $size: "$sucessors" }, 0] },
                  ],
                },
                { $size: "$sucessors" },
                0,
              ],
            },
          },
        },
      ]).exec();

      const totalCriticalRole = totalAggregate[0].count;
      const totalSuccesors = totalAggregate[0].totalSucessors;

      const totalTalentAggregate = await Talent.aggregate([
        matchQuery,
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]).exec();

      const totalTalent = totalTalentAggregate[0].count;
      console.log(totalTalent, "totalTalent");

      return {
        totalCriticalRole,
        totalTalent,
        totalSuccesors,
      };

      // You can use totalCriticalRole and totalTalent for further processing.
    } catch (error) {
      console.error("Error while fetching analytics:", error);
    }
  }

  async updateCriticalRole(
    criticalRoleId: string,
    companyId: string,
    data: IUpdateCriticalRoles
  ) {
    //find the critical role to be remove from the target company
    const role = await fetchOneQuery(CriticalRole, {
      _id: criticalRoleId,
      companyId: companyId,
    });

    if (!role) {
      throw new NotFoundError("Role Not found");
    }

    await updateQuery(
      CriticalRole,
      { _id: criticalRoleId, companyId: companyId },
      data
    );

    return "Role updated successfully";
  }

  async deleteCriticalRole(criticalRoleId: string, companyId: string) {
    //find the critical role to be remove from the target company
    const role = await fetchOneQuery(CriticalRole, {
      _id: criticalRoleId,
      companyId: companyId,
    });

    if (!role) {
      throw new NotFoundError("Role with Id within your company not found");
    }

    //soft delete
    await updateQuery(
      CriticalRole,
      { _id: criticalRoleId, companyId: companyId },
      { isDeleted: true }
    );
    return "Role deleted successfully";
  }
}

export default CriticalRoleService;
