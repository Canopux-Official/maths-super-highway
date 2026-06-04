import * as XLSX from 'xlsx';

export const exportUsersToExcel = (users: any[], filename: string) => {
    // 1. Format the data to make it readable for non-tech Indian users
    const formattedData = users.map((user, index) => {
        // Extract Target Exams as a comma-separated string
        const targetExams = user.targetExams 
            ? user.targetExams.map((exam: any) => exam.name).join(', ')
            : 'N/A';

        // Format Date
        const joinedDate = user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            })
            : 'N/A';

        // Format Role
        const role = user.role 
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1) 
            : 'Unknown';

        return {
            'S.No.': index + 1,
            'Full Name': user.name || 'N/A',
            'Email Address': user.email || 'N/A',
            'Phone Number': user.phone || 'N/A',
            'Target Exam(s)': targetExams,
            'Role': role,
            'Status': user.isActive ? 'Active' : 'Inactive',
            'Joined Date': joinedDate
        };
    });

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 3. Customize column widths for better readability
    worksheet['!cols'] = [
        { wch: 8 },  // S.No.
        { wch: 25 }, // Full Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 25 }, // Target Exam(s)
        { wch: 12 }, // Role
        { wch: 10 }, // Status
        { wch: 15 }  // Joined Date
    ];

    // 4. Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // 5. Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
