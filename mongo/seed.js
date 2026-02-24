const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME || 'my-app';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

    const User = require('./models/User');
    const Vacancy = require('./models/Vacancy');
    const Candidate = require('./models/Candidate');
    const Comment = require('./models/Comment');

    await User.deleteMany({});
    await Vacancy.deleteMany({});
    await Candidate.deleteMany({});
    await Comment.deleteMany({});

    // Создаем пользователей   
  
    const users = await User.create([
      { firstName: 'Анна', surname: 'Пирогова', secondName: 'Александровна', email: 'anna@hr.com', password: '123', role: 'hr' },
      {
        firstName: 'Михаил',
        surname: 'Пирогов',
        secondName: 'Александрович',
        email: 'ivan@dev.com',
        password: '123',
        role: 'candidate',
        experience:[{
          company: 'Itech',
          position: 'frontend',
          years: 3,
        },{
          company: 'Google',
          position: 'backend',
          years: 1,
        },
        {
          company: 'Yandex',
          position: 'backend',
          years: 2,
        },] 
      },
      { firstName: 'Анна', surname: 'Пирогова', secondName: 'Александровна', email: 'maria@design.com', password: '123', role: 'candidate' },
    ]);

    // Создаем вакансии (без комментариев)
    const vacancies = await Vacancy.create([
      {
        title: 'Senior React Developer',
        description: 'Ищем React-разработчика для крутого проекта',
        requirements: ['React', 'TypeScript', 'Next.js'],
        company: 'Itech20',
        level: 'senior',
        salary: { min: 300000, max: 400000 },
        createdBy: users[0]._id,
      },
      {
        title: 'Middle Frontend Developer',
        description: 'Разработка интерфейсов',
        requirements: ['React', 'Redux', 'CSS'],
        company: 'Google',
        level: 'middle',
        salary: { min: 200000, max: 280000 },
        createdBy: users[0]._id,
      },
      {
        title: 'Junior Frontend Developer',
        description: 'Позиция для начинающих',
        requirements: ['HTML', 'CSS', 'JavaScript'],
        company: 'Yandex',
        level: 'junior',
        salary: { min: 80000, max: 120000 },
        createdBy: users[0]._id,
      },
    ]);

    // Создаем комментарии отдельно
    const commentsData = [
      {
        vacancy: vacancies[0]._id,
        user: users[1]._id,
        text: 'Отличная вакансия! Прошел собеседование, все понравилось',
        rating: 5,
      },
      {
        vacancy: vacancies[0]._id,
        user: users[2]._id,
        text: 'Интересные задачи, но требования завышены',
        rating: 4,
      },
      {
        vacancy: vacancies[1]._id,
        user: users[1]._id,
        text: 'Хорошие условия, дружная команда',
        rating: 5,
      },
    ];

    const comments = await Comment.create(commentsData);

    // Обновляем вакансии: добавляем комментарии и пересчитываем рейтинг
    for (const vacancy of vacancies) {
      const vacancyComments = comments.filter(
        (c) => c.vacancy.toString() === vacancy._id.toString()
      );
      vacancy.comments = vacancyComments.map((c) => c._id);
      await vacancy.updateRating();
    }

    // Создаем отклики
    await Candidate.create([
      { userId: users[1]._id, vacancyId: vacancies[0]._id, status: 'interview', matchScore: 95 },
      { userId: users[2]._id, vacancyId: vacancies[0]._id, status: 'rejected', matchScore: 60 },
      { userId: users[1]._id, vacancyId: vacancies[1]._id, status: 'new', matchScore: 88 },
    ]);

    // Выводим результат
    const allVacancies = await Vacancy.find()
      .populate('comments', 'text rating user')
      .populate('comments.user', 'name');
  
    for (const vac of allVacancies) {
      vac.comments.forEach((c) => {});
    }

    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

seedDatabase();
