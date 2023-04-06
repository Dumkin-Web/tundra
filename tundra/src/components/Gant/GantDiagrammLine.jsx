import React from "react"

const GantDiagrammLine = ({task, dayList}) => {

    const getDateOdds = (inWork ,created, deadline) => {
        let odd = 1
        const start = inWork ? new Date(inWork).getDate() : new Date(created).getDate();

        if(!deadline){
            return [start, odd]
        }
        const end = new Date(deadline).getDate();

        odd = end - start;

        return [start, odd]


    }

    const [start, odd] = getDateOdds(task.inWork, task.createdAt, task.deadline)

    return (
        <tr>
            <td>{task.name}</td>
            {dayList.map((e, index) => {
                if(index == start - 1){
                    return <td key={index} colSpan={odd+1}><div className="timeLine" style={{maxHeight: '200px'}}>a</div></td>
                }
                else if(index >= start - 1 && index <= start + odd - 1){
                    return
                }
                return <td key={index}></td>
            })}
        </tr>
    )
};

export default GantDiagrammLine;
