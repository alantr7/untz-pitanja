import { navigate } from "./utils/navigate"

export function ClassesManager() {
    return <div className="group-manager">
        <div id="current-group">
            <a>Predmeti</a>
        </div>
        
        <button data-action="edit" onClick={navigate(`/predmeti`)} />
    </div>
}