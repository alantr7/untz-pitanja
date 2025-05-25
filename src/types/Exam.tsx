export type Exam = {
    title: string,
    questions: ExamQuestion[],

    default_random_questions_count: number,
    answer_validation?: boolean
}

export type ExamQuestion = {
    question: string,
    answer_type: ExamQuestionAnswerType,

    // If answer type is: SINGLE_CHOICE or MULTIPLE_CHOICE
    choices?: string[],
    correct_choices?: number[],

    // If answer type is: PARAGRAPH
    answer?: string,
}

export type ExamQuestionAnswerType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "NO_ANSWER" | "PARAGRAPH";