import { UntzGroup } from "../types/UntzGroup";

export namespace Database {

    export function getLastViewed(): {classId: string, examId: string} | undefined {
        return localStorage.getItem("lastViewed") !== null
                    ? JSON.parse(localStorage.getItem("lastViewed") as string)
                    : undefined;
    }

    export function setLastViewed(classId: string, examId: string) {
        localStorage.setItem("lastViewed", JSON.stringify({classId, examId}));
    }

    export function getGroup(): UntzGroup {
        return localStorage.getItem("classGroup") !== null
                    ? JSON.parse(localStorage.getItem("classGroup") as string) as UntzGroup
                    : {classes: []};
    }

    export function saveGroup(group: UntzGroup) {
        localStorage.setItem("classGroup", JSON.stringify(group));
    }

}