import { useParams } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { useCallback, useEffect, useState } from "react";
import { Exam, ExamQuestion } from "../types/Exam";
import axios from "axios";
import { QuestionRenderer } from "./QuestionRenderer";
import mapa from '../assets/mapa.json';
import { UntzClass } from "../types/UntzClass";
import '../styles/exam_view.scss';
import { Database } from "../utils/Database";
import { navigate } from "../utils/navigate";

export function ExamView() {
    const { class_id, test_id } = useParams();
    const [untzClass, setUntzClass] = useState<UntzClass>();
    const [exam, setExam] = useState<Exam>();
    const [generationId, setGenerationId] = useState<number>(0);
    const [randomQuestions, setRandomQuestions] = useState<ExamQuestion[]>([]);
    const [randomQuestionsCount, setRandomQuestionsCount] = useState(0);
    const [isValidating, setIsValidating] = useState(false);
    const [isQuestionsBlur, setIsQuestionsBlur] = useState(true);

    // If there is no group loaded, redirect to group editor
    if (Database.getGroup().classes.length === 0) {
        setTimeout(navigate("/predmeti"), 10);
    }

    // If class or exam do not exist, pick the previously viewed or a random one
    if (class_id === undefined || test_id === undefined) {
        const lastViewed = Database.getLastViewed();
        if (lastViewed !== undefined) {
            navigate(`/testovi/${lastViewed.classId}/${lastViewed.examId}`)();
        }
    }

    // Pick N random questions from the questions list
    const randomizeQuestions = useCallback(() => {
        const list = [...(exam?.questions || [])];
        const targetCount = Math.min(randomQuestionsCount, list.length);
        const questions: ExamQuestion[] = [];
        for (let i = 0; i < targetCount; i++) {
            questions.push(list.splice(Math.floor(Math.random() * list.length), 1)[0]);
        }

        setGenerationId(Date.now());
        setIsValidating(false);
        setRandomQuestions(questions);
    }, [exam, randomQuestionsCount]);



    // Validate questions if they are all answered
    const handleValidate = () => {
        setIsValidating(true);
    }


    // Load class
    useEffect(() => {
        // @ts-ignore
        const untzClass = mapa[class_id];
        setUntzClass(untzClass);
    }, [class_id]);


    // Load random questions when exam loads
    useEffect(() => { randomizeQuestions() }, [exam]);


    // Load new questions and cancel previous fetch if active
    useEffect(() => {
        const abortController = new AbortController();
        axios.get(`/testovi/${class_id}/${test_id}.json`, { signal: abortController.signal }).then(r => {
            setExam(r.data);
            setRandomQuestionsCount(r.data.default_random_questions_count);

            Database.setLastViewed(class_id as string, test_id as string);
        });

        return () => abortController.abort()
    }, [class_id, test_id]);


    return <div className="layout-container">
        <Sidebar />
        <div className="main-container">
            {(class_id === undefined || exam === undefined) && <h3 style={{marginTop: '32px'}}>Molimo izaberite test</h3>}
            <main style={{visibility: class_id === undefined || exam === undefined ? "hidden" : "visible"}}>
                <h1>{untzClass?.name}</h1>
                <h3>{exam?.title}</h3>

                <section className="randomly-picked-questions">
                    <ol>
                        <h4>Nasumično odabrana pitanja</h4>
                        {randomQuestions.map((question, idx) => <li key={idx}>
                            <QuestionRenderer generationId={generationId} checked={[]} isValidating={isValidating} question={question} />
                        </li>)}
                    </ol>
                    {exam?.answer_validation && <button className="btn-validate" onClick={handleValidate}>Provjeri</button>}
                    <div className="reroll">
                        <button id="reroll-btn" onClick={randomizeQuestions}>Ponovi nasumični odabir</button>
                        <div className="question-count-input">
                            <span className="editIcon">✎</span>
                            <input type="number" value={randomQuestionsCount} onChange={e => (setRandomQuestionsCount(e.target.valueAsNumber))} />
                        </div>
                        <span>pitanja</span>
                    </div>
                </section>

                <section className="questions-list" data-blured={isQuestionsBlur}>
                    <ol>
                        <h4>Lista pitanja <button className="toggle-btn" onClick={() => setIsQuestionsBlur(!isQuestionsBlur)}>{isQuestionsBlur ? "Prikaži" : "Sakrij"}</button></h4>
                        {exam?.questions?.map((question, idx) => <li key={generationId + "_" + idx}>
                            <QuestionRenderer generationId={generationId} checked={question.correct_choices || []} question={question} input_disabled={true} />
                        </li>)}
                    </ol>
                </section>
            </main>
        </div>
    </div>
}