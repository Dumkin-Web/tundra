import React, { useState } from "react"
import { getAllTasks } from "../http/userApi";
import Calendar from "../components/Calendar/Calendar";

import '../style/myTasks.scss'

const MyTasks = () => {

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

    const [tasks, setTasks] = useState([])
    const [month, setMonth] = useState((new Date(Date.now())).getMonth())
    const [year, setYear] = useState((new Date(Date.now())).getFullYear())
    const [loading, setLoading] = useState(true)

    useState(() => {
        getAllTasks().then(data => {
            setTasks(data)
            setLoading(false)
        })
    }, [])

    if(loading){
        return <div></div>
    }

    return (
        <div className="myTasks">
            <Calendar year={year} setYear={setYear} month={month} setMonth={setMonth} d={monthAndDays[month].d} name={monthAndDays[month].name} tasks={tasks} />
        </div>
    )
};

export default MyTasks;
