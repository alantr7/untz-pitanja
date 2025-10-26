import ReactModal from "react-modal";

interface ExamSimulationModalProps {
    isOpen: boolean,
    onRequestClose: () => void,
    children: any,
}

export default function ExamSimulationModal(props: ExamSimulationModalProps) {
    return <ReactModal isOpen={props.isOpen} onRequestClose={props.onRequestClose} overlayClassName="exam-simulation-modal-overlay" className="exam-simulation-modal">
        {props.children}
    </ReactModal>
}