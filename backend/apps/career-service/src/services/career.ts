import { ServiceError, type CareerDTO } from "@careeros/shared-types";
import {
  careerRepository,
  toCareerDTO,
  toRequirement,
} from "../repositories/career";

export const careerService = {
  async list(): Promise<CareerDTO[]> {
    const careers = await careerRepository.list();
    return careers.map((c) => toCareerDTO(c, false));
  },

  async get(careerRef: string): Promise<CareerDTO> {
    const career = await careerRepository.find(careerRef);
    if (!career) {
      throw new ServiceError("CAREER_NOT_FOUND", "Career does not exist");
    }
    return toCareerDTO(career, true);
  },

  async require(careerRef: string) {
    const career = await careerRepository.find(careerRef);
    if (!career) {
      throw new ServiceError("CAREER_NOT_FOUND", "Career does not exist");
    }
    return { career, requirements: career.skills.map(toRequirement) };
  },
};
