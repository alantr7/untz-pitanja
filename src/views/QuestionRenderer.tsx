import { useCallback, useEffect, useRef, useState } from "react";
import { ExamQuestion } from "../types/Exam";
import temml from 'temml';

interface QuestionRendererProps {
    question: ExamQuestion,
    generationId: number,
    isValidating?: boolean,
    checked: number[],
    input_disabled?: boolean
}
export function QuestionRenderer(props: QuestionRendererProps) {
    const { question, input_disabled } = props;
    const questionRef = useRef<HTMLSpanElement>(null);
    const solutionRef = useRef<HTMLDivElement>(null);
    const [ checked, setChecked ] = useState<number[]>(props.checked);

    useEffect(() => {
        setChecked(props.input_disabled ? props.checked : []);
    }, [props.generationId]);

    useEffect(() => {
        if (questionRef.current) {
            questionRef.current.innerHTML = renderFencedMath(question.question);
        }
    }, [questionRef.current, question]);

    useEffect(() => {
        if (solutionRef.current) {
            solutionRef.current.innerHTML = renderFencedMath(question.answer as string);
        }
    }, [solutionRef.current, question]);

    const handleChange = useCallback((idx: number) => {
        setChecked(prev => {
            if (prev.includes(idx))
                return [...prev].filter(item => item !== idx)

            return [...prev, idx];
        });
    }, [ checked ]);

    return <div className="question-container layout-70-30">
        <div style={{display: "inline"}}>
            <span ref={questionRef}>{question.question}</span><br />
            {question.answer_type === "SINGLE_CHOICE" && <ul>
                <form className="radio-button-group">
                    {question.choices?.map((choice, idx) => <li className="radio-option">
                        <label>
                            <input type="radio" name="choice" checked={checked.includes(idx)} onChange={() => handleChange(idx)} disabled={input_disabled || props.isValidating} />
                            {choice}

                            {props.isValidating && props.question.correct_choices?.length &&
                                <span className="radio-validation" data-correct={props.question.correct_choices.includes(idx)}></span>
                            }
                        </label>
                    </li>)}
                </form>
            </ul>}
            {question.answer_type === "SOLUTION" && <div className="solution" ref={solutionRef}></div>}
            {question.answer_type === "MULTIPLE_CHOICE" && <ul>
                
            </ul>}
        </div>
        <div className="graphics">
            {question.graphics?.map(g => <img key={g} src={g}></img>)}
        </div>
    </div>
}

function renderFencedMath(text: string) {
    return text.replace(/\n/g, "<br style=\"margin-bottom: 2px\">").replace(/\$(.+?)\$/g, (_, expr) => temml.renderToString(expr));
    }