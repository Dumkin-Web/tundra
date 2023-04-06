import React, { useEffect, useState } from "react"

import chevronLeft from '../../svgIcons/chevron-left-solid.svg'
import chevronRight from '../../svgIcons/chevron-right-solid.svg'
import { HandySvg } from "handy-svg";
import GantDiagrammLine from "./GantDiagrammLine";

const GantDiagramm = ({year, setYear, month, setMonth, d, name, tasks}) => { //NAME == MONTH NAME

    const [dayList, setDayList] = useState([])
    const [taskList, setTaskList] = useState([])

    console.log('month ' + month);

    const getMonth = () => {
        const tempMonthly = []
        let monthDayQuantity = d;

        if(!((year - 2020) / 4).toString().includes('.') && month == 1){
            monthDayQuantity += 1
        }  

        for(let i = 1; i < monthDayQuantity+1; i++ ){
            tempMonthly.push('')
        }

        return tempMonthly
    }

    const getMonthlyTasks = () => {
        let tempMonthly = []
        let monthDayQuantity = d;

        tasks.forEach((task) => {
            if(task.inWork && (new Date(task.inWork)).getMonth() == month){
                console.log(task.inWork);
                tempMonthly.push(task)
            }
            else if(!task.inWork && (new Date(task.createdAt)).getMonth() == month){

                tempMonthly.push(task)

            }
        })

        tempMonthly = tempMonthly.sort((a, b) => {
            const ainWork = a.inWork ?? a.createdAt;
            const binWork = b.inWork ?? b.createdAt;

            if((new Date(ainWork)).getDate() - (new Date(binWork)).getDate() != 0){
                return (new Date(ainWork)).getDate() - (new Date(binWork)).getDate()
            }
            else if(a.deadline && b.deadline){
                return (new Date(a.deadline)).getDate() - (new Date(b.deadline)).getDate()
            }
            else if(a.deadline){
                return 1
            }
            else if(b.deadline){
                return -1
            }
            return 0
        });

        console.log(tempMonthly);

        return tempMonthly
    }

    useEffect(() => {

        setTaskList(getMonthlyTasks())
        setDayList(getMonth())
        console.log('effect');

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
        <div className="gantDiagramm">
            <div className="gantHeader">
                <HandySvg src={chevronLeft} className="chevron" onClick={goBack}/>
                <div className="name">{name} {year}</div>
                <HandySvg src={chevronRight} className="chevron" onClick={goForward} />
            </div>
            <table className="gantTable">
                <thead>
                    <tr>
                    <th>TASKS</th>
                    {dayList.map((el, index) => {
                        return <th key={index}>{index+1}</th>
                    })}
                    </tr>
                </thead>
                <tbody>
                    {taskList.map((task, index) => {
                        return <GantDiagrammLine key={index} task={task} dayList={dayList} />
                    })}
                </tbody>
            </table>
        </div>
    )
};

export default GantDiagramm;
