const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const { MONGO_URI } = process.env;

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Modelos
const Activity = require('../models/Activity');  // Ajusta la ruta según tu estructura de archivos
const Resident = require('../models/Resident');
const Session = require('../models/Session');

// Lista de títulos de actividades realistas
const activityTitles = [
    "Taller de Arte y Manualidades",
    "Clase de Ejercicio en Grupo",
    "Jornada de Cine y Debate",
    "Sesión de Lectura y Reflexión",
    "Música en Vivo y Karaoke",
    "Juegos de Mesa y Rompecabezas",
    "Taller de Cocina y Repostería",
    "Charla sobre Historia y Cultura"
];

// Crear Actividades
const createActivities = async () => {
    const activities = activityTitles.map(title => ({
        title,
        description: faker.lorem.sentence(),
        image_path: faker.image.url(), // Usar url() en lugar de imageUrl()
        sessions: [] // Inicializar el campo de sesiones
    }));
    return Activity.insertMany(activities);
};

// Crear Residentes
const createResidents = async () => {
    const groups = [
        { identificator: 'I', subdivision: 'A' },
        { identificator: 'I', subdivision: 'B' },
        { identificator: 'II', subdivision: '' }
    ];

    const residents = [];
    for (let i = 0; i < 60; i++) { // Cambiado a 60 residentes
        const group = groups[Math.floor(Math.random() * groups.length)];
        residents.push({
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            emergency: {
                nameOfEmergencyContact: faker.person.fullName(),
                phoneNumber: faker.phone.number()
            },
            birthday: faker.date.past({ years: 80, refDate: new Date(1940, 0, 1) }),
            address: {
                street: faker.location.streetAddress(),
                yardnumber: faker.location.buildingNumber(),
                zipcode: faker.location.zipCode(),
                city: faker.location.city(),
                country: faker.location.country()
            },
            images: [],
            moreinfo: faker.lorem.paragraph(),
            sessions: [], // Aquí se actualizarán las sesiones
            attendance: [], // Aquí se actualizará la asistencia
            group: group
        });
    }
    return Resident.insertMany(residents);
};

// Función para comprobar si una fecha es fin de semana
const isWeekend = (date) => {
    const day = date.getDay(); // 0 = domingo, 6 = sábado
    return day === 0 || day === 6;
};

// Generar una fecha aleatoria dentro del mes (excluyendo fines de semana)
const getRandomDate = (startDate, endDate) => {
    const availableDates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        if (!isWeekend(currentDate)) {
            availableDates.push(new Date(currentDate)); // Copiar la fecha
        }
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Siguiente día
    }
    
    const randomIndex = Math.floor(Math.random() * availableDates.length);
    return availableDates[randomIndex];
};

// Crear Sesiones
const createSessions = async (activities, residents) => {
    const sessions = [];
    const startDate = new Date('2024-07-01');
    const endDate = new Date('2024-07-31');
    const maxSessions = 60; // Máximo de 60 sesiones en total
    const minSessions = 20; // Mínimo de 20 sesiones en total

    let totalSessions = 0;
    const sessionDates = new Set();

    // Crear sesiones en fechas aleatorias
    while (totalSessions < maxSessions || totalSessions < minSessions) {
        const randomDate = getRandomDate(startDate, endDate);
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        // Seleccionar al menos 8 residentes aleatorios para la sesión
        let sessionResidents = [];
        while (sessionResidents.length < 8) {
            const randomResident = residents[Math.floor(Math.random() * residents.length)];
            if (!sessionResidents.includes(randomResident._id)) {
                sessionResidents.push(randomResident._id);
            }
        }
        // Crear la sesión con fecha predeterminada
        const session = new Session({
            activityId: activity._id,
            observations: faker.lorem.sentence(),
            residentIds: sessionResidents,
            createdAt: randomDate.toISOString()
        });

        // Guardar la sesión en la base de datos
        await session.save();
        sessions.push(session);
        totalSessions += 1;

        // Actualizar las sesiones en los residentes
        for (const residentId of sessionResidents) {
            const resident = await Resident.findById(residentId);
            if (resident) {
                resident.sessions.push({
                    sessionId: session._id,
                    activityId: activity._id,
                });
                await resident.save();
            }
        }

        // Actualizar el documento de Activity para incluir la sesión
        const activityDoc = await Activity.findById(activity._id);
        if (activityDoc) {
            activityDoc.sessions.push(session._id);
            await activityDoc.save();
        }

        // Añadir la fecha de la sesión a un conjunto de fechas para actualizaciones posteriores
        sessionDates.add(randomDate.toISOString());
    }

    return sessions;
};

// Ejecutar el seeder
const seedDatabase = async () => {
    try {
        const activities = await createActivities();
        const residents = await createResidents();
        await createSessions(activities, residents);
        console.log('Base de datos sembrada con éxito');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error);
    }
};

seedDatabase();
