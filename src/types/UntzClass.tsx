export type UntzClass = {
    id: string,
    name: string,
    category: string,
    exams: UntzClassExam[],
    tags?: string[],
}

export type UntzClassExam = {
    id: string,
    name: string,
}