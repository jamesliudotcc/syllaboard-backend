import { getRepository, getManager, createConnection } from 'typeorm';
import { User } from './User';
import { Assignment } from './Assignment';
import { Cohort } from './Cohort';

createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: Number(process.env.MONGO_PORT),
  database: 'test3',
  entities: [User, Assignment, Cohort],
  useNewUrlParser: true,
  synchronize: true,
  logging: false,
}).then(async connection => {
  try {
    const userRepository = getRepository(User);
    const assignmentRepository = getRepository(Assignment);
    const cohortRepository = getRepository(Cohort);
    const manager = getManager();

    const Assignment1 = {
      student: '5c58aa8dc4990b39dd2eefb9',
      instructor: '5c588927a3aa0d038d6763c6',
      instructions: 'Create a resume',
      resourcesUrls: [
        'https://zety.com/blog/how-to-make-a-resume',
        'https://www.thebalancecareers.com/how-to-create-a-professional-resume-2063237',
      ],
      deadline: new Date('2019-02-17'),
    };

    const createdAssignment = await assignmentRepository.create(Assignment1);
    const savedAssignment = await manager.save(createdAssignment);
    console.log(savedAssignment);
  } catch (error) {
    console.log('Something went wrong', error);
  }
});
