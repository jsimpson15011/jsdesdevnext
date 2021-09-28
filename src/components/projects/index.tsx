import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

import styles from './projects.module.css'

import React, { FunctionComponent, ReactNode} from "react";
import {tag, project} from "@components/projects/types"


type projectProps = {
    tagState: tag[],
    clickableTagState: Set<unknown>,
    visibleProjects: project[],
    handleTagClick: (tag: tag) => void,
    handleTagReset: () => void,
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void,
    searchValue: string,
    children?: ReactNode
}

const Projects: FunctionComponent<projectProps> = ({
                                                       tagState,
                                                       clickableTagState,
                                                       visibleProjects,
                                                       handleTagClick,
                                                       handleTagReset,
                                                       handleSearch,
                                                       searchValue
                                                   }: projectProps) => {


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

        if(tag.isVisible){
            return (
                <button disabled={!clickableTagState.has(tag._id)} className={styles.tag + " " + currStyle}
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
                        background: `linear-gradient(146.41deg, rgba(0, 71, 117, 0.9) 19.96%, rgba(3, 57, 93, 0.9) 86.12%), url("${project.backgroundImage}")`,
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
                <input value={searchValue} type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleSearch(e)
                }} className={styles.searchFormInput}/>
            </div>
            <div className={styles.tagFilterContainer}>
                {tagFilterButtons}
            </div>

            <TransitionGroup>
                {projectComponents}
            </TransitionGroup>
        </>
    )
}

export default Projects