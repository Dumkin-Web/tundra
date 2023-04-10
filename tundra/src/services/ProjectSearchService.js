
const ProjectSearch = (projectList, searchString) => {
    let resultList = []
    if(searchString[0] !== '#'){

        const tmpSearch = String(searchString).toLocaleLowerCase().split(" ")
        projectList.forEach((project) => {
            let inc = false
            tmpSearch.forEach(str => {
                if(String(project.name).toLocaleLowerCase().includes(str)){
                    inc = true
                }
            })
            if(inc){
                resultList.push(project)
            }
        })

    }
    else{
        const tmpSearch = String(searchString).replace('#', '').toLocaleLowerCase()
        projectList.forEach((project) => {
            if(project.project_type.name.toLocaleLowerCase().includes(tmpSearch)){
                resultList.push(project)
            }
        })

    }

    return resultList
}

export default ProjectSearch