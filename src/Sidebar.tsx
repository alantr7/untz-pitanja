import { useParams } from "react-router-dom";
import { UntzClass } from "./types/UntzClass";
import { ClassesManager } from "./ClassesManager";
import { Database } from "./utils/Database";
import untzClasses from "./assets/mapa.json";

export function Sidebar() {
  const { class_id, test_id } = useParams();
  const group = Database.getGroup();
  const classes = group?.classes || [];
  return (
    <div className="sidebar">
      <ClassesManager />
      <hr
        color="#D7D7D7"
        style={{ width: "256px", borderWidth: "0 0 1px 0" }}
      />
      {/* @ts-ignore */}
      {classes.map((classId) => (
        <SidebarItemGroup
          class_id={class_id as string}
          test_id={test_id as string}
          // @ts-ignore
          untzClass={untzClasses[classId as string]}
        />
      ))}
    </div>
  );
}

function SidebarItemGroup(props: {
  class_id: string;
  test_id: string;
  untzClass: UntzClass;
}) {
  return (
    <div
      className={`item-group ${props.class_id === props.untzClass.id ? "active" : ""}`}
    >
      <div className="tree-branch"></div>
      <a href={`/#/testovi/${props.untzClass.id}/${props.untzClass.exams[0].id}`}><button
        className="group-button"
        data-category={props.untzClass.category}
      >
        <div>
          {props.untzClass.name}< br />
          <div className="tags">
            {props.untzClass.tags?.map(ex => <span key={ex}>{ex}</span>)}
          </div>
        </div>
      </button></a>
    </div>
  );
}
