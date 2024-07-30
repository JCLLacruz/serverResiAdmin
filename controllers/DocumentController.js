const PdfPrinter = require('pdfmake');
const Activity = require('../models/Activity');
const Resident = require('../models/Resident');
const Session = require('../models/Session');

const DocumentController = {
    async monthResume(req, res) {
        try {
            const { month, year, identificator, subdivision } = req.body;
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);

            // Fetch session and resident data
            const sessions = await Session.find({
                createdAt: { $gte: startDate, $lt: endDate },
            }).populate('activityId residentIds');

            const residents = await Resident.find({
                'group.identificator': identificator,
                'group.subdivision': subdivision,
            });

            // Determine group name based on identificator and subdivision
            const groupName = (() => {
                if (identificator === 'I') {
                    return subdivision === 'A' ? 'I/A LLEVANT' : 'I/B PONENT';
                } else if (identificator === 'II') {
                    return 'LLEVEIG';
                }
                return '';
            })();

            // Define fonts (Using pdfmake default fonts)
            const printer = new PdfPrinter({
                Roboto: {
                    normal: 'config/fonts/roboto/Roboto-Regular.ttf',
                    bold: 'config/fonts/roboto/Roboto-Bold.ttf',
                    italics: 'config/fonts/roboto/Roboto-Italic.ttf',
                    bolditalics: 'config/fonts/roboto/Roboto-BoldItalic.ttf',
                },
            });

            // Create document definition
            const docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'landscape',
                content: [],
                defaultStyle: {
                    font: 'Roboto',
                    fontSize: 10,
                },
            };

            // Create a page for each activity
            const uniqueActivities = [...new Set(sessions.map(session => session.activityId.title))];
            
            uniqueActivities.forEach(activityTitle => {
                const activitySessions = sessions.filter(session => session.activityId.title === activityTitle);
                const body = [];
                
                // Get the days of the month
                const daysInMonth = new Date(year, month, 0).getDate();
                const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                
                // Add table header
                body.push([
                    { text: 'Nombre', bold: true },
                    ...allDays.map(day => day.toString())
                ]);
                
                // Add resident rows
                residents.forEach(resident => {
                    const row = [
                        { text: `${resident.firstname} ${resident.lastname}` }
                    ];

                    // Determine attendance for each day of the month
                    for (let day of allDays) {
                        const date = new Date(year, month - 1, day);
                        const sessionForDay = activitySessions.find(
                            session => new Date(session.createdAt).getDate() === day
                        );

                        const attendanceRecord = resident.attendance.find(
                            record => new Date(record.date).getDate() === day
                        );

                        // Check if it's a weekend
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                        if (isWeekend) {
                            // Keep weekend cells empty
                            row.push({ text: '', fillColor: '#d3d3d3' });
                        } else if (attendanceRecord && attendanceRecord.attend) {
                            // Resident attended the center
                            if (sessionForDay && sessionForDay.residentIds.some(id => id.equals(resident._id))) {
                                // Resident attended the session
                                row.push({
                                    text: 'B',
                                    color: 'blue',
                                    fillColor: null
                                });
                            } else {
                                // Resident attended the center but no session
                                row.push({
                                    text: '',
                                    fillColor: null
                                });
                            }
                        } else {
                            // Resident did not attend the center
                            row.push({
                                text: 'X',
                                color: 'red',
                                fillColor: null
                            });
                        }
                    }
                    body.push(row);
                });

                // Add empty rows if needed
                for (let i = 0; i < (25 - residents.length); i++) {
                    body.push([
                        { text: ' ' },
                        ...allDays.map(() => ({ text: '' }))
                    ]);
                }

                // Add page for each activity
                docDefinition.content.push(
                    {
                        columns: [
                            { width: '*', text: '' }, // empty column to take up the remaining space
                            {
                                width: 'auto',
                                table: {
                                    widths: [50, 50, 50],
                                    body: [
                                        [{ text: '', border: [false, false, false, false] }, { text: 'Año', bold: true }, { text: 'Mes', bold: true }],
                                        [{ text: 'Fecha', bold: true, border: [true, true, true, true] }, year.toString(), month.toString()],
                                    ],
                                },
                                layout: {
                                    hLineWidth: () => 1,
                                    vLineWidth: () => 1,
                                    hLineColor: '#000',
                                    vLineColor: '#000',
                                    paddingLeft: () => 4,
                                    paddingRight: () => 4,
                                    paddingTop: () => 2,
                                    paddingBottom: () => 2
                                }
                            }
                        ],
                        margin: [0, 0, 0, 10] // Add some margin below the header table
                    },
                    {
                        columns: [
                            { text: 'CONTROL DE ACTIVIDAD', style: 'header', bold: true },
                            { text: `PROGRAMA: ${activityTitle}`, style: 'header', bold: true },
                            { text: `GRUPO: ${groupName}`, style: 'header', bold: true, alignment: 'right' }
                        ]
                    },
                    {
                        table: {
                            headerRows: 1,
                            widths: [100, ...allDays.map(() => 13)],
                            body
                        },
                        layout: {
                            hLineWidth: (i, node) => (i === 1 || i === node.table.body.length) ? 1 : 0.5,
                            vLineWidth: (i, node) => (i === 1 || i === node.table.widths.length) ? 1 : 0.5,
                            hLineColor: '#000',
                            vLineColor: '#000',
                            paddingLeft: () => 4,
                            paddingRight: () => 4,
                            paddingTop: () => 2,
                            paddingBottom: () => 2
                        }
                    },
                    { text: ' ', pageBreak: 'after' } // Page break after each activity
                );
            });

            // Generate PDF
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            res.setHeader('Content-disposition', 'attachment; filename=actividad.pdf');
            res.setHeader('Content-type', 'application/pdf');
            pdfDoc.pipe(res);
            pdfDoc.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('An error occurred while processing the document');
        }
    }
};

module.exports = DocumentController;
