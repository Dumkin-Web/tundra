import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap";

import './gant.scss'
import GantDiagramm from "./GantDiagramm";

const GantModal = ({tasks, show, setShow}) => {

    const monthAndDays = {
        0: {d: 31, name: 'January'},
        1: {d: 28, name: 'February'},
        2: {d: 31, name: 'March'},
        3: {d: 30, name: 'April'},
        4: {d: 31, name: 'May'},
        5: {d: 30, name: 'June'},
        6: {d: 31, name: 'July'},
        7: {d: 31, name: 'August'},
        8: {d: 30, name: 'September'},
        9: {d: 31, name: 'October'},
        10: {d: 30, name: 'November'},
        11: {d: 31, name: 'December'}
    }

    const [month, setMonth] = useState((new Date(Date.now())).getMonth())
    const [year, setYear] = useState((new Date(Date.now())).getFullYear())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMonth((new Date(Date.now())).getMonth())
        setYear((new Date(Date.now())).getFullYear())
    }, [show])

    return (
        <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="gantSize">
            <Modal.Header closeButton>
                <Modal.Title>Gant diagramm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <GantDiagramm year={year} setYear={setYear} month={month} setMonth={setMonth} d={monthAndDays[month].d} name={monthAndDays[month].name} tasks={tasks} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default GantModal;
