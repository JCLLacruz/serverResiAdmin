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
            const daysInMonth = new Date(year, month, 0).getDate();

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
                pageOrientation: 'landscape',
                pageSize: 'A4',
                content: [
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
                        ]
                    },
                    { text: ' ' }, // Spacer
                    {
                        columns: [
                            { text: 'CONTROL DE ACTIVIDAD', bold: true },
                            { text: `GRUPO: ${groupName}`, bold: true, alignment: 'right' }
                        ]
                    },
                    { text: ' ' }, // Spacer
                    {
                        table: {
                            headerRows: 2,
                            widths: [100, ...Array.from({ length: daysInMonth }, () => 15)], // Adjust column widths here
                            body: [
                                [
                                    { text: '', border: [false, false, false, false] }, 
                                    ...Array.from({ length: daysInMonth }, (_, i) => {
                                        const day = i + 1;
                                        const sessionForDay = sessions.find(
                                            (session) => new Date(session.createdAt).getDate() === day
                                        );
                                        const activityTitle = sessionForDay ? sessionForDay.activityId.title : '';
                                        return { text: activityTitle.split('').join('\n'), bold: true, alignment: 'center', fontSize: 6 };
                                    })
                                ],
                                [{ text: 'Nombre', bold: true}, ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())],
                                ...residents.map((resident) => [
                                    { text: `${resident.firstname} ${resident.lastname}` },
                                    ...Array.from({ length: daysInMonth }, (_, i) => {
                                        const day = i + 1;
                                        const date = new Date(year, month - 1, day);
                                        const sessionForDay = sessions.find(
                                            (session) => new Date(session.createdAt).getDate() === day && session.residentIds.some((id) => id.equals(resident._id))
                                        );
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        return sessionForDay
                                            ? { text: 'B', color: 'blue', fillColor: isWeekend ? '#d3d3d3' : null }
                                            : { text: isWeekend ? '' : 'X', color: 'red', fillColor: isWeekend ? '#d3d3d3' : null }; // No 'X' on weekends
                                    }),
                                ]),
                                ...Array.from({ length: 25 - residents.length }, () => [
                                    { text: ' ' }, ...Array.from({ length: daysInMonth }, (_, i) => {
                                        const day = i + 1;
                                        const date = new Date(year, month - 1, day);
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        return { text: '', fillColor: isWeekend ? '#d3d3d3' : null };
                                    })
                                ])
                            ],
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
                ],
                defaultStyle: {
                    font: 'Roboto',
                    fontSize: 6,
                },
            };
            

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
    },
};

module.exports = DocumentController;
