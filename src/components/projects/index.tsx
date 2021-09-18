import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

import styles from './projects.module.css'

import React, {Component, FunctionComponent, ReactNode} from "react";
type tag = {
    _id: string,
    title: string,
    isActive: boolean,
    isVisible: boolean
}

type projectProps = {
    tagState: tag[],
    clickableTagState: any,
    visibleProjects: any,
    handleTagClick: (tag:tag)=>void,
    children?: ReactNode
}

const Projects: FunctionComponent<projectProps> = ({tagState, clickableTagState, visibleProjects, handleTagClick} : projectProps) => {
    const activeTagStyle = {
        fontWeight: "bold",
        background: "yellow",
        width: "200px"
    } as const

    const inactiveTagStyle = {
        ...activeTagStyle,
        background: "gray"
    } as const

    const disabledTagStyle = {
        ...inactiveTagStyle,
        background: "#9e9e9e",
        fontWeight: "light",
        color: "#4f5252"
    } as const

    const tagFilterButtons = tagState.map((tag: tag) => {

        const isClickable = clickableTagState.has(tag._id)
        let currStyle = inactiveTagStyle

        if (tag.isActive) {
            currStyle = activeTagStyle as never
        }

        if (!isClickable) {
            currStyle = disabledTagStyle as never
        }

        return (
            <button disabled={!clickableTagState.has(tag._id)} style={currStyle}
                    onClick={() => {
                        handleTagClick(tag)
                    }} key={tag._id}>
                {tag.title}
            </button>
        )


    })


    const projectComponents = visibleProjects.map(((project: any) => {
        return (
            <CSSTransition onExit={()=> {console.log("test")}} key={project._id} timeout={500} classNames={{
                enter: styles.itemEnter,
                enterActive: styles.itemEnterActive,
                exit: styles.itemExit,
                exitActive: styles.itemExitActive
            }}>
                <div>
                    <div className={styles.projectContainer}>
                        <h2>{project.title}</h2>
                        <div>
                            {
                                project.tags.map((tag: tag) => {
                                    return (
                                        <a key={tag._id}>
                                            {tag.title}
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>
            </CSSTransition>
        )
    }))




    return (
        <>
            {tagFilterButtons}
            <TransitionGroup>
                {projectComponents}
            </TransitionGroup>
        </>
    )
}

export default Projects