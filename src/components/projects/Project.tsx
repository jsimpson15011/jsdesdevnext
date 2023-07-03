import React, {FunctionComponent, useCallback, useRef, useState} from "react";
import styles from "@components/projects/projects.module.css";
import {project, tag} from "@components/projects/types";

type projectProps = {
    project: project,
    tagState: tag[]
}
const Project: FunctionComponent<projectProps> = ({project, tagState}: projectProps) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const glowRef = useRef<HTMLDivElement | null>(null);

    const rotateCard = useCallback(
        (e: MouseEvent) => {
            const bounds = cardRef.current?.getBoundingClientRect();
            const glowBounds = glowRef.current?.getBoundingClientRect();
            if (!bounds || !glowBounds) return;

            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const newCenter = {x: leftX - bounds.width / 2, y: topY - bounds.height / 2};

            setCenter(newCenter);
            setGlowPosition({
                x: mouseX - bounds.left - glowBounds.width / 2,
                y: mouseY - bounds.top - glowBounds.height / 2
            });
            setDistance(Math.sqrt(newCenter.x ** 2 + newCenter.y ** 2));
        }, [cardRef]
    );
    const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!glowRef.current) return;
        setScale(1.02);
        cardRef.current = e.currentTarget;

        glowRef.current.style.opacity = "1";

        e.currentTarget.addEventListener("mousemove", rotateCard)
    }
    const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!glowRef.current) return;
        e.currentTarget.removeEventListener("mousemove", rotateCard);
        glowRef.current.style.opacity = "0";
        setScale(1);
        setCenter({x: 0, y: 0});
        setDistance(0);
    }
    const [center, setCenter] =
        useState<{ x: number, y: number }>({x: 0, y: 0});
    const [distance, setDistance] = useState<number>(0);
    const [scale, setScale] = useState(1);
    const [glowPosition, setGlowPosition] = useState({x: 0, y: 0});

    return (
        <div>
            <div onMouseEnter={(e) => handleEnter(e)}
                 onMouseLeave={(e) => handleLeave(e)}
                 className={styles.projectContainer} style={{
                background: project.backgroundImage ?
                    `linear-gradient(146.41deg, rgba(0, 71, 117, 0.9) 19.96%, rgba(3, 57, 93, 0.9) 86.12%), url("${project.backgroundImage}")` :
                    '',
                backgroundSize: `cover`,
                transform:
                    `scale3d(${scale}, ${scale}, ${scale})
                                 rotate3d(${center.y / 100},
                                    ${-center.x / 100},
                                    0,
                                    ${distance === 0 ? 0 : Math.log(distance) * 2}deg)`

            }}>
                <div
                    className={styles.glow}
                    style={{
                    left: glowPosition.x,
                    top: glowPosition.y,
                    height: 500,
                    width: 500,
                    position: "absolute",
                    opacity: 0
                }} ref={glowRef}/>
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
    )
}

export default Project;
