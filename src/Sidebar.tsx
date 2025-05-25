import { useParams } from "react-router-dom"
import { UntzClass } from "./types/UntzClass";
import { useState } from "react";
import { ClassesManager } from "./ClassesManager";
import { Database } from "./utils/Database";
import untzClasses from './assets/mapa.json';

export function Sidebar() {
    const { class_id, test_id } = useParams();
    const group = Database.getGroup();
    const classes = group?.classes || [];
    return <div className="sidebar">
        <ClassesManager />
        <hr color="#D7D7D7" style={{width: '256px', borderWidth: '0 0 1px 0'}} />
        {/* @ts-ignore */}
        {classes.map((classId) => <SidebarItemGroup class_id={class_id as string} test_id={test_id as string} untzClass={untzClasses[classId as string]} />)}
    </div>
}

function SidebarItemGroup(props: { class_id: string, test_id: string, untzClass: UntzClass }) {
    const [ isExpanded, setExpanded ] = useState(false);
    return <div className={`item-group ${props.class_id === props.untzClass.id ? 'active' : ''}`} data-expanded={isExpanded}>
        <div className="tree-branch"></div>
        <button className="group-button" onClick={() => setExpanded(!isExpanded)} data-category={props.untzClass.category}>{props.untzClass.name}</button>
        <ul className="exam-container">
            {isExpanded && props.untzClass.exams.map((exam, idx) => <li key={idx}><a href={`/#/testovi/${props.untzClass.id}/${exam.id}`}>
                <button className={`exam-button ${props.test_id === exam.id && props.untzClass.id === props.class_id ? 'active' : ''}`}>&nbsp;&nbsp;{exam.name}</button>
            </a></li>)}
        </ul>
    </div>
}