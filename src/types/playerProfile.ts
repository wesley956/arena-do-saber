export type PlayerGoal =
  | "literacy"
  | "school"
  | "contest"
  | "general";

export type StudyStage =
  | "literacy"
  | "fundamental1"
  | "fundamental2"
  | "highSchool"
  | "adult";

export type ContestTrack =
  | "pm"
  | "gcm"
  | "cityHall"
  | "bank"
  | "administrative"
  | "court"
  | "other";

export interface LocalPlayerProfile {
  nickname: string;
  goal: PlayerGoal;
  studyStage: StudyStage;
  contestTrack?: ContestTrack;
  createdAt: string;
  updatedAt: string;
}
