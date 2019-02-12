import { Deliverable } from '../../entity/Deliverable';
import {
  assignmentRepository,
  cohortRepository,
  deliverableRepository,
  manager,
  usersRepository,
} from '../instructor';

export async function assignmentToDeliverable(req) {
  const instructor = await usersRepository.findOne(req.user._id);
  const cohort = await cohortRepository.findOne(req.params.id);
  const assignment = await assignmentRepository.findOne(req.body.assignmentId);
  cohort.students.forEach(async studentId => {
    // For each id in cohort, pull a student
    // Create a new Deliverable, copying assignment into new deliverable
    const deliverable = new Deliverable();
    deliverable.name = assignment.name;
    deliverable.student.push(studentId);
    deliverable.cohort.push(cohort._id);
    deliverable.instructions = assignment.instructions;
    deliverable.instructor.push(instructor._id);
    deliverable.resourcesUrls = assignment.resourcesUrls;
    deliverable.topics = assignment.topics;
    deliverable.deadline = new Date(req.body.dueDate);
    const freshDeliverable = await manager.save(deliverable);
    const savedDeliverable = await deliverableRepository.findOne(
      freshDeliverable,
    );
    // Save deliverable to student
    const student = await usersRepository.findOne(studentId);
    student.deliverables.push(savedDeliverable._id);
    // console.log(student);
    const savedStudent = await manager.save(student);
    console.log(savedStudent);
  });
  return { instructor, cohort, assignment };
}
