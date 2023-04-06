import React from "react"
import { useSelector } from "react-redux";

const Dialog = () => {

    const dialog = useSelector(state => state.dialog)

    if(dialog.id == ''){
        return <></>
    }

    return (
        <div className="dialog">
            Hi
        </div>
    )
};

export default Dialog;
