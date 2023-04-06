import React, { useEffect, useState } from "react"
import { getAllDialogs } from "../../http/userApi";
import Dialog from "../../components/Dialog/Dialog";

import './dialogsPage.scss'

const DialogsPage = () => {

    const [dialogs, setDialogs] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllDialogs().then(data => {
            console.log(data);
            setDialogs(data)
            setLoading(false)
        })
    }, [])

    if(loading){
        return <div></div>
    }

    return (
        <div className="dialogsPage">
            <div className="dPageContainer">
                <div className="dialogPageHeader">
                    <div className="pageName">All dialogs</div>
                </div>
                <div className="dialogPageBody">
                    <div className="dialogsList">
                        <div className="projectDialogsList">
                            {dialogs.projectDialogs.map((dialog) => {
                                return  <div key={dialog.id} className="dialogTab">
                                            <div className="dialogName">
                                                {dialog.project.name}
                                            </div>
                                        </div>
                            })}
                        </div>
                        <div className="privateDialogsList">
                            {dialogs.privateDialogs.map((dialog) => {
                                console.log(dialog);
                                return  <div key={dialog.id} className="dialogTab">
                                            <div className="dialogName">
                                                {dialog.users[0].fullName}
                                            </div>
                                        </div>
                            })}
                        </div>
                    </div>
                    <Dialog />
                </div>
            </div>
        </div>
    )
};

export default DialogsPage;
