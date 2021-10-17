import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

import styles from './projects.module.css'

import React, {FunctionComponent, ReactNode, useEffect, useState} from "react";
import {tag, project} from "@components/projects/types";
import {isMobile} from "react-device-detect"
import Fuse from "fuse.js";


type projectProps = {
    projects: project[],
    tags: tag[],
    children?: ReactNode
}

const Projects: FunctionComponent<projectProps> = ({projects, tags}: projectProps) => {
    const initialTags = tags.map((tag: { title: string, _id: string }) => {
        return {
            _id: tag._id,
            title: tag.title,
            isActive: false,
            isVisible: true
        }
    })

    const initialProjects = projects.map((projects: project) => {
        return (
            {
                ...projects,
                isVisible: true
            }
        )
    })

    const initialClickableTags = new Set();

    projects.forEach((project: project) => {
        project?.tags?.forEach((tag: { _id: string }) => {
            initialClickableTags.add(tag._id)
        })
    })

    const [tagState, updateTags] = useState(initialTags)
    const [projectState, updateProjects] = useState(initialProjects)
    const [visibleProjects, updateVisibleProjects] = useState(initialProjects)
    const [clickableTagState, updateClickableTags] = useState(initialClickableTags)
    const[searchValue, setSearchValue] = useState("");
    const [tagFilterGradientMaxWidth, setGradientMaxWidth] = useState(45);
    const [nextIsMobile, setMobile] = useState(false);

    const handleTagFilterScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const maxScroll = e.currentTarget.scrollWidth - e.currentTarget.clientWidth
        const currScroll = e.currentTarget.scrollLeft

        setGradientMaxWidth(maxScroll - currScroll)
    }

    useEffect(() => {
        setMobile(isMobile)
    }, [setMobile])

    function handleTagClick(tag: tag) {
        const updatedTags = tagState.map((currTag: tag) => {
            if (currTag._id === tag._id) {
                return (
                    {
                        ...currTag,
                        isActive: !currTag.isActive
                    }
                )
            } else {
                return currTag
            }
        })

        updateTags(updatedTags)
    }

    function handleTagReset(){
        const updatedTags = tagState.map((curr: tag) => {
            return(
                {
                    ...curr,
                    isActive: false
                }
            )
        })

        updateTags(updatedTags)
    }

    function handleSearchClear(){
        setSearchValue('')
    }

    const fuseOptions = {
        keys: ["title"]
    }

    useEffect(() => {

        const fuse = new Fuse(tagState, fuseOptions)

        const fuseResult = fuse.search(searchValue)

        const updatedTags = tagState.map((tag: tag) => {
            if(!searchValue)
            {
                return {
                    ...tag,
                    isVisible: true
                }
            }
            const isInFuse = fuseResult.filter((fuse: { item : {_id:string} }) => {
                return fuse.item._id === tag._id
            }).length > 0;

            return({
                ...tag,
                isVisible: isInFuse
            })
        })

        updateTags(updatedTags)
    }, [searchValue])

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
        e.preventDefault()
        setSearchValue(e.target.value)
    }

    useEffect(() => {
        handleProjectUpdate()
    }, [tagState])

    useEffect(() => {
        const updatedClickableTags = new Set();

        projectState.forEach((project: project) => {
            if (project.isVisible) {
                project?.tags?.forEach((tag: { _id: string }) => {
                    updatedClickableTags.add(tag._id)
                })
            }
        })

        const updatedProject = projectState.filter((project: project) => {
            return project.isVisible;
        })

        updateClickableTags(updatedClickableTags)
        updateVisibleProjects(updatedProject)
    }, [projectState])

    function handleProjectUpdate() {
        const activeTagSet = new Set();

        tagState.forEach((tag: tag) => {
            if (tag.isActive) {
                activeTagSet.add(tag._id)
            }
        })

        const updatedProjects = projectState.map((currProject: project) => {
            const projectTagSet = new Set();
            let isVisible = true

            currProject?.tags?.forEach((tag: { _id: string }) => {
                projectTagSet.add(tag._id)
            })

            activeTagSet.forEach((tag: unknown) => {
                if (!projectTagSet.has(tag)) {
                    isVisible = false
                }

            })

            return {
                ...currProject,
                isVisible: isVisible
            }
        })

        updateProjects(updatedProjects)
    }

    const hasActiveTags = tagState.filter((tag: tag) => {
        return tag.isActive
    }).length > 0

    const tagFilterButtons = tagState.map((tag: tag) => {

        const isClickable = clickableTagState.has(tag._id)
        let currStyle = styles.inactiveTag

        if (tag.isActive) {
            currStyle = styles.activeTag
        }

        if (!isClickable) {
            currStyle = styles.disabledTag
        }

        if (tag.isVisible) {
            return (
                <button style={{whiteSpace: "nowrap"}} disabled={!clickableTagState.has(tag._id)}
                        className={styles.tag + " " + currStyle}
                        onClick={() => {
                            handleTagClick(tag)
                        }} key={tag._id}>
                    {tag.title}
                </button>
            )
        }

    })


    const projectComponents = visibleProjects.map(((project: project) => {
        return (
            <CSSTransition key={project._id} timeout={600} classNames={{
                enter: styles.itemEnter,
                enterActive: styles.itemEnterActive,
                exit: styles.itemExit,
                exitActive: styles.itemExitActive
            }}>
                <div>
                    <div className={styles.projectContainer} style={{
                        background: project.backgroundImage ?
                            `linear-gradient(146.41deg, rgba(0, 71, 117, 0.9) 19.96%, rgba(3, 57, 93, 0.9) 86.12%), url("${project.backgroundImage}")` :
                            ''
                        ,
                        backgroundSize: `cover`

                    }}>
                        <div className={`${styles.projectCol} ${styles.projectColSmall}`}>
                            <img className={`${styles.mainImage}`} src={project.mainImage} alt=""/>
                        </div>
                        <div className={`${styles.projectCol} ${styles.projectColLarge}`}>
                            <h2 className={styles.projectMainHeader}>{project.title}</h2>
                            <h3 className={styles.projectSubHeader}>{project.subTitle}</h3>
                            <div className={`${styles.projectDescription}`}>
                                {project.description}
                            </div>
                        </div>

                        <div className={styles.projectRow}>
                            <div className={styles.bottomTags}>
                                {
                                    project?.tags?.map((tag: { title: string, _id: string }) => {
                                        let bottomTagStyle = styles.bottomTag
                                        const findTag = tagState.filter((currTag: tag) => {
                                            return (currTag._id === tag._id && currTag.isActive)
                                        })

                                        if (findTag.length > 0) {
                                            bottomTagStyle += " " + styles.bottomTagActive
                                        }
                                        return (
                                            <a className={bottomTagStyle} key={tag._id}>
                                                {tag.title}
                                            </a>
                                        )
                                    })
                                }
                            </div>
                            {
                                project.externalUrl ?
                                    <a className={styles.externalLink} href={project.externalUrl}>View</a> : ""
                            }

                        </div>


                    </div>

                </div>
            </CSSTransition>
        )
    }))

    return (
        <>
            <div className={styles.searchForm}>
                <h2 className={styles.searchFormHeader}>Filter by Tag</h2>
                {
                    hasActiveTags ?
                        <button onClick={handleTagReset} className={styles.searchFormButton}>Clear Filter</button> : ""
                }
                <div className={styles.searchFormInputContainer}>
                    <input value={searchValue} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleSearch(e)
                    }} className={styles.searchFormInput}/>
                    <button style={{display: searchValue.length > 0 ? "block" :"none"}} className={styles.clearSearchButton} onClick={handleSearchClear}>
                        <img src="/icons/icon-close-circle.svg" alt="clear tag search query"/>
                    </button>
                </div>

            </div>
            <div className={styles.tagFilterContainer} onScroll={(e) => {
                handleTagFilterScroll(e)
            }}>
                {tagFilterButtons}
                <div style={{maxWidth: `${tagFilterGradientMaxWidth}px`}}
                     className={nextIsMobile ? styles.tagFilterGradient : "none"}/>
            </div>

            <TransitionGroup>
                {projectComponents}
            </TransitionGroup>
        </>
    )
}

export default Projects