export type UntzClass = {
    id: string,
    name: string,
    category: string,
    exams: UntzClassExam[]
}

export type UntzClassExam = {
    id: string,
    name: string,
}