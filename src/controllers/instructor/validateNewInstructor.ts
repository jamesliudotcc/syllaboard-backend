import { Assignment } from '../../entity/Assignment';
import { assignmentRepository, manager } from '../instructor';
export async function validateNewInstructor(incoming: any) {
  const assignment = new Assignment();
  if (incoming.cohortType) {
    assignment.cohortType = incoming.cohortType;
  }
  if (incoming.cohortWeek) {
    assignment.cohortWeek = incoming.cohortWeek;
  }
  if (incoming.instructions) {
    assignment.instructions = incoming.instructions;
  }
  if (incoming.instructor) {
    assignment.instructor = incoming.instructor;
  }
  if (incoming.name) {
    assignment.name = incoming.name;
  }
  if (incoming.resourcesUrls) {
    assignment.resourcesUrls = incoming.resourcesUrls;
  }
  if (incoming.topics) {
    assignment.topics = incoming.topics;
  }
  assignment.version = 1;
  const createdAssignment = await assignmentRepository.create(assignment);
  const savedAssignment = await manager.save(createdAssignment);
  const mintedAssignment = await assignmentRepository.findOne(savedAssignment);
  return mintedAssignment;
}
