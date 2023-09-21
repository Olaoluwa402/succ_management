export interface ICreateTalent{
    criticalRoleId: string;
    talent: {
        employeeId: string,
        employeeName: string,
        employeeEmail: string,
        employmentDate: Date
    },
}

