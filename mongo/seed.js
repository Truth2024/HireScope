const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const MONGODB_URI = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME || 'my-app';




async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('✅ Connected to DB');
    const SKILLS = require('../src/shared/constants/skills');
    const User = require('./models/User');
    const Vacancy = require('./models/Vacancy');
    const Candidate = require('./models/Candidate');
    const Comment = require('./models/Comment');

    // 🧹 Полная очистка
    await Promise.all([
      User.deleteMany({}),
      Vacancy.deleteMany({}),
      Candidate.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log('🧹 Database cleared');

    // 👤 Создаём пользователей
    const users = await User.create([
      {
        firstName: 'Алексей',
        surname: 'Иванов',
        secondName: 'Петрович',
        email: 'leszczynski114@gmail.com',
        password:  await bcrypt.hash('12345678', 5),
        role: 'candidate',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        avatarBlur: '/images/23.png',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS', 'Git'],
        experience: [
          {
            company: 'TechCorp',
            position: 'Senior Frontend Developer',
            years: 3
          },
          {
            company: 'WebSolutions',
            position: 'Frontend Developer',
            years: 2
          },
          {
            company: 'StartupHub',
            position: 'Junior Developer',
            years: 1
          }
        ],
      },
      {
        firstName: 'Анна',
        surname: 'Пирогова',
        secondName: 'Александровна',
        email: 'anna@hr.com',
        password:  await bcrypt.hash('12345678', 5),
        role: 'hr',
        skills: [],
      },
      {
        firstName: 'Михаил',
        surname: 'Пирогов',
        secondName: 'Александрович',
        email: 'ivan@dev.com',
        password: '123',
        role: 'candidate',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Git', 'AWS'],
        experience: [
          {
            company: 'DataTech',
            position: 'Python Developer',
            years: 4
          },
          {
            company: 'Startup',
            position: 'Backend Developer',
            years: 2
          }
        ],
      },
      {
        firstName: 'Мария',
        surname: 'Иванова',
        secondName: 'Сергеевна',
        email: 'maria@design.com',
        password: '123',
        role: 'candidate',
        skills: ['HTML', 'CSS', 'SASS', 'Tailwind', 'JavaScript', 'Figma'],
        experience: [
          {
            company: 'Design Studio',
            position: 'UI/UX Designer',
            years: 3
          },
          {
            company: 'Web Agency',
            position: 'Frontend Designer',
            years: 2
          }
        ],
      },
    ]);
    console.log('👤 Users created');

    // 💼 Создаём вакансии
    const vacancies = await Vacancy.create([
      {
        title: 'Senior React Developer',
        description: 'Ищем опытного React-разработчика для работы над крупным проектом',
        requirements: ['React', 'TypeScript', 'Next.js', 'Redux', 'Git'],
        company: 'Itech20',
        level: 'senior',
        salary: { min: 300000, max: 400000 },
        createdBy: users[0]._id,
      },
      {
        title: 'Middle Frontend Developer',
        description: 'Разработка интерфейсов для внутренних проектов',
        requirements: ['React', 'Redux', 'JavaScript', 'HTML', 'CSS'],
        company: 'Google',
        level: 'middle',
        salary: { min: 200000, max: 280000 },
        createdBy: users[0]._id,
      },
      {
        title: 'Senior Next.js Developer',
        description: 'Ищем разработчика для работы над Next.js приложением',
        requirements: ['Next.js', 'React', 'TypeScript', 'Node.js'],
        company: 'Itech20',
        level: 'senior',
        salary: { min: 350000, max: 450000 },
        createdBy: users[0]._id,
      },
      {
        title: 'Python Backend Developer',
        description: 'Разработка backend на Python',
        requirements: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        company: 'DataTech',
        level: 'middle',
        salary: { min: 250000, max: 350000 },
        createdBy: users[0]._id,
      },
      {
        title: 'DevOps Engineer',
        description: 'Администрирование и автоматизация',
        requirements: ['Docker', 'Kubernetes', 'AWS', 'Git'],
        company: 'CloudCorp',
        level: 'senior',
        salary: { min: 400000, max: 500000 },
        createdBy: users[0]._id,
      },
    ]);
    console.log('💼 Vacancies created');

    // 💬 Создаём комментарии
    const comments = [];
    
    // Комментарии для первой вакансии (с разными оценками)
    for (let i = 0; i < 15; i++) {
      comments.push({
        vacancy: vacancies[0]._id,
        user: users[2]._id,
        text: i < 10 ? 'Отличная вакансия!' : 'Нормальные условия',
        rating: i < 8 ? 5 : 4,
      });
    }
    
    for (let i = 0; i < 5; i++) {
      comments.push({
        vacancy: vacancies[0]._id,
        user: users[2]._id,
        text: 'Плохой опыт',
        rating: 1,
      });
    }
    
    // Комментарии для второй вакансии
    for (let i = 0; i < 8; i++) {
      comments.push({
        vacancy: vacancies[1]._id,
        user: users[1]._id,
        text: 'Хорошая команда',
        rating: 5,
      });
    }
    
    // Комментарии для третьей вакансии
    for (let i = 0; i < 6; i++) {
      comments.push({
        vacancy: vacancies[2]._id,
        user: users[2]._id,
        text: 'Интересные задачи',
        rating: 4,
      });
    }
    
    await Comment.create(comments);
    console.log('💬 Comments created');

    // 🔥 Привязываем комментарии к вакансиям и пересчитываем рейтинг
    for (const vacancy of vacancies) {
      const vacancyComments = comments.filter(
        (c) => c.vacancy.toString() === vacancy._id.toString()
      );
      vacancy.comments = vacancyComments.map((c) => c._id);
      await vacancy.updateRating();
    }
    console.log('⭐ Ratings calculated');

    // 📩 Создаём отклики кандидатов
    await Candidate.create([
      {
        userId: users[1]._id,
        vacancyId: vacancies[0]._id,
        status: 'interview',
        matchScore: 95,
      },
      {
        userId: users[2]._id,
        vacancyId: vacancies[0]._id,
        status: 'rejected',
        matchScore: 60,
      },
      {
        userId: users[3]._id,
        vacancyId: vacancies[1]._id,
        status: 'new',
        matchScore: 85,
      },
      {
        userId: users[2]._id,
        vacancyId: vacancies[2]._id,
        status: 'offer',
        matchScore: 92,
      },
    ]);
    console.log('📩 Candidates created');

    console.log('🎉 Seed completed successfully');
    
    // Вывод статистики
    console.log('\n📊 Статистика:');
    console.log(`Пользователей: ${await User.countDocuments()}`);
    console.log(`Вакансий: ${await Vacancy.countDocuments()}`);
    console.log(`Комментариев: ${await Comment.countDocuments()}`);
    console.log(`Кандидатов: ${await Candidate.countDocuments()}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();