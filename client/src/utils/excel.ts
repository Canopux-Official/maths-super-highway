import * as XLSX from 'xlsx';
import * as XLSXS from 'xlsx-js-style';

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

export const exportTopicStudentsToExcel = (students: any[], topicTitle: string, topicPath?: string) => {
    const fmt = (d?: string) =>
        d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    const headers = ['S.No.', 'Full Name', 'Email Address', 'Phone Number', 'Target Exam(s)', 'Selected On'];
    const body = [...students]
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .map((s, i) => [
            i + 1,
            s.name || 'N/A',
            s.email || 'N/A',
            s.phone || 'N/A',
            s.targetExams?.length ? s.targetExams.map((e: any) => e.name).join(', ') : 'N/A',
            fmt(s.selectedAt),
        ]);

    const bold = { font: { bold: true } };
    const rows: any[][] = [
        [{ v: `Topic: ${topicTitle}`, t: 's', s: { font: { bold: true, sz: 14 } } }],
        [{ v: topicPath ? `Path: ${topicPath}` : '', t: 's' }],
        [],
        headers.map((h) => ({ v: h, t: 's', s: bold })),
        ...body,
    ];

    const worksheet = XLSXS.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];
    worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    ];

    // file / sheet names cannot contain  \ / ? * [ ] :
    const safe = topicTitle.replace(/[\\/?*\[\]:]/g, ' ').replace(/\s+/g, ' ').trim() || 'Topic';
    const workbook = XLSXS.utils.book_new();
    XLSXS.utils.book_append_sheet(workbook, worksheet, safe.slice(0, 31));
    XLSXS.writeFile(workbook, `${safe.slice(0, 80)} - students.xlsx`);
};
