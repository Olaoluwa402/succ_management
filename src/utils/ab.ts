// /**
//  * @author Idris Adeniji (alvacoder)
//  * @email idrisadeniji01@gmail.com
//  * @create date 2021-11-19 09:31:50
//  */

// import handlebars from "handlebars";
// import dotenv from "dotenv";
// import axios from "axios";
// import { addDays, subDays } from "date-fns";
// import { genericSendMail, nodemailermailgun, sendmail, sendmailWithAttachment } from "../utils/email";
// import { writeFileSync, unlinkSync } from "fs";
// import { v4 as uuidv4 } from "uuid";
// import { errorResponse, successResponse } from "../helpers/response";
// import { create, fetch, fetchOne, rawQuery, update } from "../helpers/schema";
// import JobOpportunity from "../models/job-opportunity";
// import JobApplication from "../models/job-application";
// import JobDescription from "../models/job-description";
// import JobTemplate from "../models/job-template";
// import MailTemplate from "../models/mail-templates";
// import safeCompare from "safe-compare";
// import mongoose from "mongoose";
// import TrackerUser from "../models/tracker-users";
// import { toSentenceCase } from "../utils/helpers";

// const { MyXalaryV2, MYXALARY_API_URL, JOBS_FRONTEND_URL, JWT_SECRET_KEY } = process.env;

// // TODO:
// // Get creator id and company id from token

// const createJobOpportunity = async function (req, res) {
//   let { body, user, company } = req;
//   let opportunity;
//   if (!body.replyTo) {
//     body.replyTo = company.userEmail
//   }
//   try {
//     opportunity = await create(JobOpportunity, body);
//     sendNewJobPosting(opportunity)
//     return successResponse(res, {
//       statusCode: 200,
//       message: "Job opportunity created successfully.",
//       payload: opportunity,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const editJobOpportunity = async function (req, res) {
//   const { body, params } = req;
//   const { opportunityID: _id } = params;
//   try {
//     const job = await update(
//       JobOpportunity,
//       { _id },
//       body
//     );
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: job,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fetchActiveJobOpportunityByCompany = async function (req, res) {
//   let jobs;
//   const { _id: companyID } = req.company;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const jobType = req.query.jobType,
//     jobRole = req.query.jobRole || "",
//     date = req.query.date || "",
//     search = req.query.search || "",
//     recent = req.query.recent
//   try {
//     const lowerDateRange = subDays(new Date(date), 1);
//     const upperDateRange = addDays(new Date(date), 1);
//     const recentDate = recent ? subDays(new Date(), parseInt(recent) + 1) : new Date("1980-01-01");
//     jobs = await fetch(JobOpportunity, {
//       companyID,
//       $or: [
//         { status: "open" },
//         { status: "ongoing" }
//       ],
//       createdAt: { $gt: new Date(recentDate) },
//     },
//       page,
//       limit,
//       ["submissions"]);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobs,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fetchJobOpportunityByCompany = async function (req, res) {
//   let jobs;
//   const { _id: companyID } = req.company;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const jobType = req.query.jobType,
//     jobRole = req.query.jobRole || "",
//     date = req.query.date || "",
//     search = req.query.search || "",
//     recent = req.query.recent
//   try {
//     const lowerDateRange = subDays(new Date(date), 1);
//     const upperDateRange = addDays(new Date(date), 1);
//     const recentDate = recent ? subDays(new Date(), parseInt(recent) + 1) : new Date("1980-01-01");
//     if (date) {
//       jobs = await fetch(JobOpportunity, {
//         companyID,
//         jobRole: { $regex: jobRole, $options: "i" },
//         $and: [{
//           applicationCloseDate: {
//             $gt: new Date(lowerDateRange)
//           },
//           applicationCloseDate: {
//             $lt: new Date(upperDateRange)
//           }
//         }],
//       },
//         page,
//         limit,
//         ["submissions"]);
//     } else {
//       jobs = await fetch(JobOpportunity, {
//         companyID,
//         jobRole: { $regex: jobRole, $options: "i" },
//         createdAt: { $gt: new Date(recentDate) }
//       },
//         page,
//         limit,
//         ["submissions"]);
//     }
//     // if job type is specified
//     if (jobType) {
//       jobs = await fetch(JobOpportunity, {
//         companyID,
//         jobRole: { $regex: jobRole, $options: "i" },
//         createdAt: { $gt: new Date(recentDate) },
//         jobType: { $in: [jobType] }
//       },
//         page,
//         limit,
//         ["submissions"]);
//     }
//     if (search) {
//       jobs = await fetch(JobOpportunity, {
//         companyID,
//         createdAt: { $gt: new Date(recentDate) },
//         $or: [
//           { jobRole: { $regex: search, $options: "i" } },
//           { location: { $regex: search, $options: "i" } },
//           { hiringDepartment: { $regex: search, $options: "i" } }
//         ]
//       },
//         page,
//         limit,
//         ["submissions"]);
//     }
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobs,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fetchJobOpportunityById = async function (req, res) {
//   let job;
//   const { opportunityID: _id } = req.params;
//   try {
//     job = await fetchOne(JobOpportunity, { _id }, ["submissions"]);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: job,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const searchJob = async function (req, res) {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   let { location, jobRole } = req.query;
//   try {
//     location ? location : (location = "");
//     jobRole ? jobRole : (jobRole = "");
//     const jobs = await fetch(JobOpportunity, {
//       $and: [{
//         status: {
//           $ne: "closed"
//         },
//         status: {
//           $ne: "filled"
//         }
//       }],
//       slots: { $gte: 1 },
//       location: { $regex: location, $options: "i" },
//       jobRole: { $regex: jobRole, $options: "i" },
//     }, page, limit);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobs,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const searchApplicants = async function (req, res) {
//   const { _id: companyID } = req.company;
//   const search = req.query.search || "";
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const specialty = req.query.specialty || "",
//     skills = req.query.skills || "";
//   let applicants;
//   try {
//     if (search) {
//       applicants = await fetch(JobApplication, {
//         companyID, $or: [
//           { fullName: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//           { specialty: { $regex: search, $options: "i" } },
//           { otherSkills: { $regex: search, $options: "i" } }
//         ]
//       }, page, limit)
//     }

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: applicants,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const searchJobTemplate = async function (req, res) {
//   let { name } = req.query;
//   const { _id: companyID } = req.company;
//   try {
//     name ? name : (name = "");
//     let categories = await fetch(JobDescription, { companyID, $or: [{ disabled: { $exists: false } }, { disabled: false }], "name": { $regex: name, $options: "i" } })
//     let templates = [];
//     categories.data.forEach(category => {
//       templates = templates.concat({ ...category, id: category.templateID });
//     })
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: templates,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const searchJobCategory = async function (req, res) {
//   let { name } = req.query;
//   const { _id: companyID } = req.company;
//   try {
//     let opts = name ? { "category": { $regex: name, $options: "i" } } : {}
//     let categories = await fetch(JobTemplate, { companyID, ...opts }, 1, 1000000)
//     const list = categories.data.map((item) => ({ category: item.category }))

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: list,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const shareJob = async function (req, res) {
//   try {
//   } catch (error) {
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const exportJobAsPdf = async function (req, res) {
//   try {
//   } catch (error) {
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const inviteSingleApplicant = async function (req, res) {
//   const {
//     submissionID: _id,
//     interviewer,
//     interviewDate,
//     interviewTime,
//     alternateInterviewDate,
//     alternateInterviewTime,
//     interviewLocation,
//   } = req.body;
//   const { company } = req;
//   try {
//     const submission = await fetchOne(JobApplication, { _id });
//     const contextObject = {
//       fullName: submission.fullName,
//       roleName: "",
//       companyName: submission.companyID,
//       interviewer,
//       interviewDate: new Date(interviewDate).toDateString(),
//       interviewTime,
//       alternateInterviewDate: new Date(alternateInterviewDate).toDateString(),
//       alternateInterviewTime,
//       interviewLocation,
//     };
//     await sendmail(company,
//       "Interview Invite",
//       contextObject,
//       "./src/mails/invite-applicant.html.hbs",
//       [submission.email]
//     );
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Invite successfully sent.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// // ToDo: Delete email templates after sending invites
// const inviteApplicants = async function (req, res) {
//   const { emailData } = req.body;
//   const { company } = req;
//   try {
//     await emailData.forEach(async (data) => {
//       const submission = await fetchOne(JobApplication, { _id: data.submissionID }, ["jobOpportunityID"]);

//       await sendmail(
//         {
//           ...company, replyTo: submission.jobOpportunityID.replyTo
//         },
//         "Interview Invite",
//         data.content,
//         [submission.email]
//       );
//       await update(JobApplication, { _id: data.submissionID }, { isInvited: true });
//     });
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Invites successfully sent.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const hireApplicants = async function (req, res) {
//   let { emailData } = req.body;
//   const { company } = req;
//   let employmentContract;
//   try {
//     if (req.files.employmentContract) {
//       employmentContract = req.files.employmentContract;
//     }
//     emailData = JSON.parse(emailData);
//     const jobOpportunity = await fetchOne(JobOpportunity, { _id: emailData[0].jobOpportunityID }, []);
//     if (emailData.length > jobOpportunity.slots) {
//       return errorResponse(res, {
//         statusCode: 400,
//         status: "failure",
//         payload: [],
//         message: "Hired applicants exceed available open slots.",
//       });
//     }
//     await emailData.forEach(async (data) => {
//       const submission = await fetchOne(JobApplication, { _id: data.submissionID });
//       await sendmailWithAttachment(
//         {
//           ...company, replyTo: submission.jobOpportunityID.replyTo
//         },
//         "You've been shortlisted for hiring",
//         data.content,
//         [submission.email],
//         employmentContract?.tempFilePath
//       );
//       const [updateApplication, updateOpportunitySlots] = await Promise.all([
//         update(JobApplication, { _id: data.submissionID }, { isHired: true }),
//         update(JobOpportunity, { _id: jobOpportunity._id }, { slots: jobOpportunity.slots - 1 })
//       ])
//     });
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Employee hiring mail sent successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const onboardApplicants = async function (req, res) {
//   const { emailData } = req.body;
//   const { company } = req;
//   try {
//     await emailData.forEach(async (data) => {
//       const submission = await fetchOne(JobApplication, { _id: data.submissionID }, ["jobOpportunityID"]);
//       if (!submission.isRejected) {
//         await sendmail(
//           {
//             ...company, replyTo: submission.jobOpportunityID.replyTo
//           },
//           "Employment Onboarding Process",
//           data.content,
//           [submission.email]
//         );
//         const updateEmployee = await update(JobApplication, { _id: data.submissionID }, { onboardingStatus: "pending" });
//       }
//     });
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Employee onboarding mail sent successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };
// const addHiringChecklistsToApplicants = async function (req, res) {
//   const { applicantIDs, hiringChecklistIDs } = req.body;
//   const { company } = req;
//   try {
//     let requestArray = [];
//     const hiringChecklists = hiringChecklistIDs.map(checklistID => {
//       return { checklistID }
//     })
//     applicantIDs.forEach(applicantID => {
//       requestArray.push(update(JobApplication, { _id: applicantID }, { hiringChecklists }))
//     })

//     const addChecklists = await Promise.all(requestArray);

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Hiring checklists added successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };
// const addOnboardingChecklistsToApplicants = async function (req, res) {
//   const { applicantIDs, onboardingChecklistIDs } = req.body;
//   const { company } = req;
//   try {
//     let requestArray = [];
//     const onboardingChecklists = onboardingChecklistIDs.map(checklistID => {
//       return { checklistID }
//     })
//     applicantIDs.forEach(applicantID => {
//       requestArray.push(update(JobApplication, { _id: applicantID }, { onboardingChecklists }))
//     })

//     const addChecklists = await Promise.all(requestArray);

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: [],
//       message: "Hiring checklists added successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fulfillHiringRequest = async function (req, res) {
//   const { checklists } = req.body;
//   const { applicantID } = req.params;
//   const { company } = req;
//   let requestArray = [];
//   try {
//     checklists.forEach(checklist => {
//       requestArray.push(update(JobApplication, { _id: applicantID, "hiringChecklists._id": checklist.id }, {
//         $set: {
//           "hiringChecklists.$.isCompleted": true,
//           "hiringChecklists.$.docUrl": checklist.docUrl,
//         }
//       }))
//     })
//     requestArray.push(update(JobApplication, { _id: applicantID }, {
//       $set: {
//         "isAccepted": true
//       }
//     }))
//     const updatedChecklist = await Promise.all(requestArray);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: updatedChecklist,
//       message: "Hiring process successfully updated.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const rejectHiringRequest = async function (req, res) {
//   const { applicantID } = req.body;
//   const { company } = req;
//   try {
//     const updatedOffer = await update(JobApplication, { _id: applicantID }, { isRejected: true });
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: updatedOffer,
//       message: "Job offer rejected successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fulfillOnboardingRequest = async function (req, res) {
//   const { checklists } = req.body;
//   const { applicantID } = req.params;
//   const { company } = req;
//   let requestArray = [];
//   try {
//     checklists.forEach(checklist => {
//       requestArray.push(update(JobApplication, { _id: applicantID, "onboardingChecklists._id": checklist.id }, {
//         $set: {
//           "onboardingChecklists.$.isCompleted": true,
//           "onboardingChecklists.$.docUrl": checklist.docUrl,
//         }
//       }))
//     })
//     requestArray.push(update(JobApplication, { _id: applicantID }, {
//       $set: {
//         "onboardingStatus": "completed"
//       }
//     }))
//     const updatedChecklist = await Promise.all(requestArray);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: updatedChecklist,
//       message: "Onboarding process successfully updated.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fetchRecruitedEmployeesByCompany = async function (req, res) {
//   let { _id: companyID } = req.company;
//   companyID = mongoose.Types.ObjectId(companyID);
//   const { status } = req.query;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const jobType = req.query.jobType,
//     jobRole = req.query.jobRole || "",
//     date = req.query.date || "",
//     search = req.query.search || "",
//     recent = req.query.recent
//   const lowerDateRange = subDays(new Date(date), 1);
//   const upperDateRange = addDays(new Date(date), 1);
//   const recentDate = recent ? subDays(new Date(), parseInt(recent) + 1) : new Date("1980-01-01");
//   let query = {}
//   if (date) {
//     query = {
//       $and: [{
//         createdAt: {
//           $gt: new Date(lowerDateRange)
//         },
//         createdAt: {
//           $lt: new Date(upperDateRange)
//         }
//       }],
//     }
//   } else {
//     query = {
//       createdAt: { $gt: new Date(recentDate) }
//     }
//   }
//   let appQuery = {}
//   try {
//     if (safeCompare(status, "hired")) {
//       appQuery = { companyID, isHired: true, isRejected: false, isAccepted: false, onboardingStatus: "not-onboarded", ...query };
//     } else if (safeCompare(status, "onboarded")) {
//       appQuery = { companyID, isHired: true, onboardingStatus: "completed", ...query };
//     } else if (safeCompare(status, "pending")) {
//       appQuery = { companyID, onboardingStatus: "pending", ...query }
//     } else if (safeCompare(status, "rejected")) {
//       appQuery = { companyID, isHired: true, isRejected: true, onboardingStatus: "not-onboarded", ...query }
//     } else if (safeCompare(status, "accepted")) {
//       appQuery = { companyID, isHired: true, isRejected: false, isAccepted: true, onboardingStatus: "not-onboarded", ...query }
//     } else {
//       appQuery = { companyID, ...query }
//     }
//     query = {};
//     if (jobType) {
//       query = {
//         "jobOpportunityID.jobType": { $in: [jobType] }
//       }
//     }
//     if (search) {
//       query = {
//         $or: [
//           { "jobOpportunityID.jobRole": { $regex: search, $options: "i" } },
//           { "jobOpportunityID.location": { $regex: search, $options: "i" } },
//           { "jobOpportunityID.hiringDepartment": { $regex: search, $options: "i" } }
//         ]
//       }
//     }
//     if (jobRole) {
//       query["jobOpportunityID.jobRole"] = { $regex: jobRole, $options: "i" }
//     }
//     let recruitedEmployees = await JobApplication.aggregate([
//       {
//         $match: {
//           ...appQuery
//         }
//       },
//       {
//         $lookup: {
//           from: "jobopportunities",
//           localField: "jobOpportunityID",
//           foreignField: "_id",
//           as: "jobOpportunityID"
//         }
//       },
//       {
//         $unwind: "$jobOpportunityID"
//       },
//       {
//         $match: {
//           "jobOpportunityID": { $ne: null },
//           ...query
//         }
//       },
//       {
//         $facet: {
//           metadata: [{ $count: "totalCount" }, { $addFields: { currentPage: page } }],
//           data: [{ $skip: ((Number(page) - 1) * Number(limit)) }, { $limit: Number(limit) }] // add projection here wish you re-shape the docs
//         }
//       },
//       {
//         $addFields: {
//           paging: { $cond: { if: { $eq: [{ $size: "$metadata" }, 0] }, then: { currentPage: page, totalPages: 0, totalCount: 0 }, else: { $arrayElemAt: ["$metadata", 0] } } }
//         }
//       },
//       {
//         $addFields: {
//           "paging.totalPages": {
//             $cond: {
//               if: { $eq: ["$paging.totalPages", 0] }, then: "$paging.totalPages", else: { $ceil: { $divide: ["$paging.totalCount", limit] } }
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           data: 1,
//           paging: 1
//         }
//       }

//     ])
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: recruitedEmployees[0],
//       message: "Recruited applicants retrieved successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const applyForJobOpportunity = async function (req, res) {
//   //TODO: prevent multiple applications on same role
//   const { body } = req;
//   try {
//     const opportunity = await fetchOne(JobOpportunity, { _id: body.jobOpportunityID });
//     const status = opportunity.status;
//     if ((!safeCompare(status, "open") && !safeCompare(status, "ongoing")) || opportunity.slots < 1) {
//       return errorResponse(res, {
//         statusCode: 400,
//         message: "Applications are no longer been accepted for this role.",
//       });
//     }
//     const application = await create(JobApplication, body);
//     sendNewApplicantMail(application)
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: application,
//       message: "Job application successfully submitted.",
//     });
//   } catch (error) {
//     console.log(error.message);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const sendNewApplicantMail = async (payload) => {
//   try {
//     payload = await payload.populate(["jobOpportunityID"]);
//     if (!payload.jobOpportunityID.replyTo) return
//     const data = {
//       fullName: payload.fullName,
//       jobRole: toSentenceCase(payload.jobOpportunityID.jobRole),
//       email: payload.email,
//       phone: payload.phone,
//       link: `${MyXalaryV2}/recruitment/job-opportunities/job/${payload.jobOpportunityID.jobRole}/${payload.jobOpportunityID._id}`

//     }
//     await genericSendMail({ subject: "New Application Recieved", data: payload, templateName: "new-application", recipients: [payload.jobOpportunityID.replyTo], data })
//   } catch (e) {
//     console.log(e)
//   }
// }

// const sendNewJobPosting = async (payload) => {
//   try {
//     let users = [];
//     if (payload.vacancyType.includes("internal")) {
//       users.push(axios.get(`${MYXALARY_API_URL}/myx3/employees/get/${payload.companyID}`, {
//         headers: {
//           authorization: `Bearer ${JWT_SECRET_KEY}`
//         }
//       }))
//     }
//     if (payload.vacancyType.includes("external")) {
//       users.push(TrackerUser.find({}, {
//         email: 1
//       }))
//     }
//     const result = await Promise.all(users);
//     users = [];
//     result.forEach((value) => {
//       let tempUsers = value?.data?.employees || value;
//       tempUsers = tempUsers.map((value) => value.employeeEmail || value.email)
//       users = [...users, ...tempUsers]
//     })

//     const recipientsVariable = {}
//     users.forEach((value, index) => {
//       recipientsVariable[value] = {
//         email: value,
//         id: index + 1
//       }
//     });
//     const data = {
//       jobRole: toSentenceCase(payload.jobRole),
//       phone: payload.phone,
//       link: `${JOBS_FRONTEND_URL}/${payload._id}`
//     }
//     await genericSendMail({ subject: "New Job Notice", data: payload, templateName: "new-job", recipients: [...users], data, recipientVariable: { ...recipientsVariable } })
//   } catch (e) {
//     console.log(e)
//   }
// }

// const editOnboardedApplicant = async function (req, res) {
//   //TODO: prevent multiple applications on same role
//   const { body, params } = req;
//   const { applicantID: _id } = params;
//   try {
//     const applicant = await update(JobApplication, { _id }, body);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: applicant,
//       message: "Onboarded applicant data successfully updated.",
//     });
//   } catch (error) {
//     console.log(error.message);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const viewSubmissionsByOpportunityID = async function (req, res) {
//   const { opportunityID: jobOpportunityID } = req.params;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const search = req.query.search || "";
//   const expectedSalary = parseInt(req.query.search) || 0;
//   const recent = req.query.recent;
//   const recentDate = recent ? subDays(new Date(), parseInt(recent) + 1) : new Date("1980-01-01");
//   try {
//     let submissions = await fetch(JobApplication, {
//       jobOpportunityID,
//       expectedSalary: { $gte: expectedSalary },
//       createdAt: { $gt: new Date(recentDate) },
//       $or: [
//         { email: { $regex: search, $options: "i" } },
//         { fullName: { $regex: search, $options: "i" } },
//         { location: { $regex: search, $options: "i" } },
//       ]
//     },
//       page,
//       limit,
//       ["jobOpportunityID"]
//     );
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: submissions,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const viewSubmissionByID = async function (req, res) {
//   const { submissionID: _id } = req.params;
//   try {
//     const submission = await fetchOne(JobApplication, { _id }, ["jobOpportunityID"]);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: submission,
//     });
//   } catch (error) {
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// };

// const fetchJobTemplates = async function (req, res) {
//   const { _id: companyID } = req.company;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   try {
//     let jobTemplates = await fetch(JobTemplate, { companyID }, page, limit);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobTemplates,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const fetchJobRoleTemplates = async function (req, res) {
//   const { _id: companyID } = req.company;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 0;
//   const search = req.query.search;
//   const filter = {};
//   if (search) {
//     filter['name'] = new RegExp(search, "i")
//   }
//   try {
//     let jobTemplates = await fetch(JobDescription, { companyID, ...filter }, page, limit, undefined, { name: "asc" });

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobTemplates,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const createJobTemplates = async function (req, res) {
//   const { category, templates, skills, certifications, degree } = req.body;
//   const { _id: companyID } = req.company;
//   try {
//     let jobTemplate = await create(JobTemplate, req.body);
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobTemplate,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const createJobRoleTemplates = async function (req, res) {
//   const { name, category } = req.body;
//   const { _id: companyID } = req.company;
//   var id = mongoose.Types.ObjectId();
//   try {
//     const nameExist = await rawQuery(JobDescription.countDocuments({
//       name: name, companyID: {
//         $ne: companyID
//       }
//     }));
//     if (nameExist) {
//       return successResponse(res, {
//         statusCode: 400,
//         status: "failed",
//         message: "job role already exist"
//       });
//     }
//     category.id = category?.id?.toLowerCase();
//     let jobTemplate = await create(JobDescription, { companyID, templateID: id, ...req.body });
//     await updateJobsTemplate(jobTemplate)

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobTemplate,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }

// }

// const updateJobsTemplate = async (jobTemplate) => {
//   const categoryExist = await rawQuery(JobTemplate.countDocuments({ companyID: jobTemplate.companyID, category: jobTemplate.category?.name }));
//   if (categoryExist) {
//     const response = await rawQuery(JobTemplate.findOne({ companyID: jobTemplate.companyID, category: jobTemplate.category?.name, "templates.id": jobTemplate.templateID }));
//     let options = {};
//     let extra = {};
//     if (response) {
//       const item = response.templates.find(item => `${item.id}` === jobTemplate.templateID);
//       if (jobTemplate.name === item?.name) {
//         console.log(`....returning`)
//         return;
//       }
//       extra = { "templates.id": jobTemplate.templateID }
//       options = {
//         $set: {
//           "templates.$.name": jobTemplate.name
//         }
//       }
//     } else {
//       options = {
//         $addToSet: {
//           templates: {
//             id: jobTemplate.templateID,
//             name: jobTemplate.name
//           }
//         }
//       }
//     }
//     const test = await rawQuery(JobTemplate.updateOne({ companyID: jobTemplate.companyID, category: jobTemplate.category?.name, ...extra }, {
//       ...options

//     }));
//   } else {
//     const test = await create(JobTemplate, { category: jobTemplate.category.name, templates: [{ id: jobTemplate.templateID, name: jobTemplate.name }], companyID: jobTemplate.companyID });
//   }
// }

// const editJobRoleTemplates = async function (req, res) {
//   const { name, templateID, ...rest } = req.body;
//   const { _id: companyID } = req.company;
//   try {
//     const nameExist = await rawQuery(JobDescription.countDocuments({ name, templateID: { $ne: templateID } }));
//     if (nameExist) {
//       return successResponse(res, {
//         statusCode: 400,
//         status: "failed",
//         message: "job role already exist"
//       });
//     }
//     rest.category.id = rest.category?.id?.toLowerCase();
//     let jobTemplate = await update(JobDescription, { companyID, templateID }, { name, ...rest });
//     await updateJobsTemplate(req.body)

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: jobTemplate,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const getJobDescriptionByTemplateID = async function (req, res) {
//   const { templateID } = req.params;
//   const { _id: companyID } = req.company;

//   try {
//     const templates = await fetchOne(JobDescription, { templateID, companyID })

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: templates,
//     });
//   } catch (error) {
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const sendMessage = async function (req, res) {
//   const { company } = req;
//   const { applicantName, applicantEmail, subject, emailContent } = req.body;
//   try {
//     const send = await sendmail(
//       company,
//       subject,
//       emailContent,
//       [applicantEmail]
//     );
//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       message: "Message successfully sent.",
//       payload: [],
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(res, {
//       statusCode: 500,
//       message: "An error occured, pls try again later.",
//     });
//   }
// }

// const pushApplicantToEmployee = async function (req, res) {
//   const { submissionID: applicantID } = req.body;
//   const { company } = req;
//   //for debug....to remove in next deployment
//   let testData, testApp;

//   try {

//     const token = req.header("Authorization");
//     const axiosConfig = {
//       headers: {
//         Authorization: token,
//       },
//     };

//     const applicantData = await fetchOne(JobApplication, { _id: applicantID })
//     if (!applicantData.isAccepted) {
//       return errorResponse(res, {
//         statusCode: 400,
//         status: "failed",
//         message: "Applicant has not accepted offer",
//       });
//     }
//     const fullName = applicantData.fullName.trim();
//     const [firstName, lastName] = fullName.split(" ").filter(v => v);
//     console.log({ firstName, lastName, x: fullName.split(" ").filter(v => v), fullName })
//     const data = {
//       employeeEmail: applicantData.email,
//       firstName: firstName,
//       middleName: firstName,
//       lastName: lastName,
//       employeeType: "clocked",
//       employeeHireDate: new Date(),
//       annualSalary: applicantData.annualSalary,
//       taxAuthority: applicantData.taxAuthority,
//       bankName: applicantData.bankInformation?.name?.toLowerCase(),
//       accountNumber: applicantData.bankInformation.accountNo,
//       dateOfBirth: applicantData.dateOfBirth,
//       religion: applicantData.personalInformation?.religion?.toLowerCase(),
//       salaryScheme: applicantData.salarySchemeID,
//       branchID: applicantData.branchID,
//       pfa: applicantData.pfa,
//       employeeCadre: applicantData.cadreID,
//       employeeCadreStep: applicantData.cadreStepID
//     }
//     testData = data;
//     testApp = applicantData
//     const { data: employee } = await axios.post(
//       `${process.env.MYXALARY_API_URL}/employees/addEmployee`, data, axiosConfig
//     );
//     if (!employee) {
//       throw new Error("Failed to migrate applicant to employee list.");
//     }

//     await update(JobApplication, { _id: applicantID }, { employeeID: employee._id, employeeHireDate: employee.employeeHireDate, isEmployed: true })

//     return successResponse(res, {
//       statusCode: 200,
//       status: "success",
//       payload: employee,
//       message: "Applicant successfully employed.",
//     });
//   } catch (error) {
//     return errorResponse(res, {
//       statusCode: error.response.data.message ? 400 : 500,
//       message: error?.response?.data?.message || "An error occured, pls try again later.",
//     });
//   }
// };

// const updateExpiredJobOpportunities = async function () {
//   let promiseArray = [];
//   let opportunities = await fetch(JobOpportunity, {
//     $expr: {
//       $and: [
//         {
//           $eq: [{ $dayOfMonth: "$applicationCloseDate" }, { $dayOfMonth: new Date() }],
//         },
//         {
//           $eq: [{ $month: "$applicationCloseDate" }, { $month: new Date() }],
//         },
//         {
//           $eq: [{ $year: "$applicationCloseDate" }, { $year: new Date() }],
//         },
//       ],
//     },
//   });

//   opportunities.data.forEach(opportunity => {
//     promiseArray.push(update(JobOpportunity, { _id: opportunity._id }, { status: "closed" }))
//   })

//   await Promise.all(promiseArray);

// }

// export {
//   createJobOpportunity,
//   editJobOpportunity,
//   fetchJobOpportunityByCompany,
//   fetchJobOpportunityById,
//   fetchRecruitedEmployeesByCompany,
//   applyForJobOpportunity,
//   editOnboardedApplicant,
//   viewSubmissionsByOpportunityID,
//   viewSubmissionByID,
//   inviteApplicants,
//   searchJob,
//   searchApplicants,
//   searchJobTemplate,
//   fetchJobTemplates,
//   getJobDescriptionByTemplateID,
//   createJobTemplates,
//   hireApplicants,
//   onboardApplicants,
//   addHiringChecklistsToApplicants,
//   addOnboardingChecklistsToApplicants,
//   fulfillHiringRequest,
//   rejectHiringRequest,
//   fulfillOnboardingRequest,
//   sendMessage,
//   pushApplicantToEmployee,
//   updateExpiredJobOpportunities,
//   fetchActiveJobOpportunityByCompany,
//   searchJobCategory,
//   fetchJobRoleTemplates,
//   createJobRoleTemplates,
//   editJobRoleTemplates
// };
