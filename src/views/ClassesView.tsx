import { useEffect, useState } from "react"
import { UntzGroup } from "../types/UntzGroup";
import { Database } from "../utils/Database";
import "../styles/groups_editor.scss";
import untzClasses from '../assets/mapa.json';
import { UntzClass } from "../types/UntzClass";
import { generateCode, validateCode } from "../utils/group_codes";
import { navigate } from "../utils/navigate";

export function ClassesView() {
    const [group, setGroup] = useState<UntzGroup>(Database.getGroup());
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<string[]>(Object.keys(untzClasses));

    const handleAddClass = (classId: string) => {
        if (group?.classes.includes(classId)) return;
        setGroup(prev => {
            const group = prev as UntzGroup;
            return { ...group, classes: [...group.classes, classId] };
        });
    }

    const handleRemoveClass = (classId: string) => {
        if (!group?.classes.includes(classId)) return;
        setGroup(prev => {
            const group = prev as UntzGroup;
            return { ...group, classes: [...group.classes].filter(c => c !== classId) };
        });
    }

    const handleToggleClass = (classId: string) => {
        if (group?.classes.includes(classId))
            handleRemoveClass(classId);
        else
            handleAddClass(classId);
    }

    const handleGenerateCode = () => {
        const code = generateCode(group.classes);
        alert(code);
    }

    const handleInputCode = () => {
        const code = prompt("Unesite kod:");
        if (code === null)
            return;

        const classes = validateCode(code);
        if (classes) {
            setGroup(prev => {
                const group = prev as UntzGroup;
                return { ...group, classes }
            });
        }
    }

    // Class search
    useEffect(() => {
        setResults(Object.values(untzClasses).map(raw => raw as UntzClass).filter(v => (
            v.name.toLowerCase().includes(query.toLowerCase())
        )).map(c => c.id));
    }, [query]);

    // Save groups to local storage whenever they get updated
    useEffect(() => {
        if (group) Database.saveGroup(group);
    }, [group]);

    return <div className="groups-editor-container">
        <div id="class-list-container">
            <h3>Dodani predmeti:</h3>
            <div className="code-buttons">
                <button onClick={handleGenerateCode}>Generiši kod</button>
                <button onClick={handleInputCode}>Unesi kod</button>
            </div>
            <hr />
            <div className="classes-container">
                {group?.classes.map((klass) => {
                    // @ts-ignore
                    const untzClass = untzClasses[klass] as UntzClass;
                    return <div className="untz-class" key={klass}>
                        <p>{untzClass.name}</p>
                        {/* <button onClick={() => handleRemoveClass(klass)}>X</button> */}
                    </div>
                })}
            </div>
            <button className="finish-editing" onClick={navigate("/testovi")}>Završi</button>
        </div>

        <div id="separator"></div>

        <div id="class-add-container">
            <h3>Dodavanje predmeta</h3>
            <div className="search-container">
                <input placeholder="Pretraga predmeta..." value={query} onChange={event => setQuery(event.target.value)} />
            </div>

            <div className="search-results">
                {results.map(key => {
                    // @ts-ignore
                    const untzClass = untzClasses[key] as UntzClass;
                    return <div key={key} className={`untz-class ${group.classes.includes(key) ? 'added' : ''}`} onClick={() => handleToggleClass(key)}>
                        <p data-category={untzClass.category}>{untzClass.name}</p>
                        <small>{untzClass.exams.map(exam => exam.name).join(" • ") || "(nema testova)"}</small>
                    </div>
                })}
            </div>

        </div>
    </div>
}