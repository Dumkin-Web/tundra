import React, { useEffect, useState } from "react"
import CalendarDate from "./CalendarDate";
import chevronLeft from '../../svgIcons/chevron-left-solid.svg'
import chevronRight from '../../svgIcons/chevron-right-solid.svg'
import { HandySvg } from "handy-svg";

const Calendar = ({year, setYear, month, setMonth, d, name, tasks}) => {

    const [taskList, setTaskList] = useState([[], []])

    const getMonthlyTasks = () => {
        const tempMonthly = []
        const tempOther = []
        for(let i = 1; i < d+1; i++ ){
            const tempT = Array.from(tasks).map((task) => {
                if(task.deadline){
                    const tempDate = new Date(task.deadline)

                    if(tempDate.getFullYear() == year && tempDate.getMonth() == month && tempDate.getDate() == i){
                        return task
                    }
                }
                else{
                    tempOther.push(task)
                }
            })
            if(tempT){
                tempMonthly.push(tempT)
            }
            else{
                tempMonthly.push([])
            }
        }

        return [tempMonthly, tempOther]

    }

    useEffect(() => {

        setTaskList(getMonthlyTasks())

    }, [month, year])

    const goBack = () => {
        if(month-1 < 0){
            setYear(year-1)
            setMonth(11)
        }
        else{
            setMonth(month-1)
        }
    }

    const goForward = () => {
        if(month+1 > 11){
            setYear(year+1)
            setMonth(0)
        }
        else{
            setMonth(month+1)
        }
    }

    return (
        <div className="calendar">
            <div className="calendarHeader">
                <HandySvg src={chevronLeft} className="chevron" onClick={goBack}/>
                <div className="name">{name} {year}</div>
                <HandySvg src={chevronRight} className="chevron" onClick={goForward} />
            </div>
            <div className="calendarBody">
                {taskList[0].map((day, index) => {
                    if(day){
                        return <CalendarDate key={index} dayIndex={index} tasks={day} />
                    }
                })}
            </div>
        </div>
    )
};

export default Calendar;
