import { useCallback, useEffect, useState } from "react";
import { ExamQuestion } from "../types/Exam";

interface QuestionRendererProps {
    question: ExamQuestion,
    generationId: number,
    isValidating?: boolean,
    checked: number[],
    input_disabled?: boolean
}
export function QuestionRenderer(props: QuestionRendererProps) {
    const { question, input_disabled } = props;
    const [ checked, setChecked ] = useState<number[]>(props.checked);

    useEffect(() => {
        setChecked(props.input_disabled ? props.checked : []);
    }, [props.generationId]);

    const handleChange = useCallback((idx: number) => {
        setChecked(prev => {
            if (prev.includes(idx))
                return [...prev].filter(item => item !== idx)

            return [...prev, idx];
        });
    }, [ checked ]);

    return <div className="question-container">
        {question.question}<br />
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
        {question.answer_type === "MULTIPLE_CHOICE" && <ul>
            
        </ul>}
    </div>
}