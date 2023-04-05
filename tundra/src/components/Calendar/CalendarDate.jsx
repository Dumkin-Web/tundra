import React from "react"

const CalendarDate = ({tasks, dayIndex}) => {
    

    const getDeadline = (dl) => {

        return (new Date(dl)).toLocaleString().split(', ')[1].slice(0, 5)

    } 

    return (
        <div className="calendarDate">
            <div className="dateHeader">
                {dayIndex + 1}
            </div>
            <div className="dateBody">
                {tasks.map((task, index) => {
                    if(task){
                    return  <div key={index} className="deadline">
                                <div className="name" style={{textDecoration: task.done ? "line-through" : "none"}}>{task.name}</div>
                                <div className="time">{getDeadline(task.deadline)}</div>
                            </div>
                    }
                })}
            </div>
        </div>
    )
};

export default CalendarDate;
