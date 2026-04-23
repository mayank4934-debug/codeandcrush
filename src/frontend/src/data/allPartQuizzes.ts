// Unified quiz data — merges all part quiz files into one lookup record.
// Use this everywhere instead of importing from individual quiz files.

import { PART_QUIZZES } from "./partQuizData";
import { EXTRA_QUIZZES_1 } from "./partQuizDataExtra1";
import { EXTRA_QUIZZES_2 } from "./partQuizDataExtra2";
import { FRONTEND_BACKEND_QUIZZES } from "./partQuizDataFrontendBackend";
import { ML_DEVOPS_ANDROID_QUIZZES } from "./partQuizDataMLDevOpsAndroid";
import { NEW_PART_QUIZZES } from "./partQuizDataNewParts";
import { TOPIC_QUIZZES } from "./partQuizDataTopicQuizzes";

export const ALL_PART_QUIZZES = {
  ...PART_QUIZZES,
  ...FRONTEND_BACKEND_QUIZZES,
  ...EXTRA_QUIZZES_1,
  ...EXTRA_QUIZZES_2,
  ...NEW_PART_QUIZZES,
  ...ML_DEVOPS_ANDROID_QUIZZES,
  ...TOPIC_QUIZZES,
};

export default ALL_PART_QUIZZES;
