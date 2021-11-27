import React, {FunctionComponent, ReactNode} from "react";
import {
    heroHeadingTaglineDescription
} from "@components/heroes/HeroHeadingTaglineDescription/types";
import styles from './hero.module.css';

type heroProps = {
    hero: heroHeadingTaglineDescription[],
    children?: ReactNode
}

const HeroHeadingTaglineDescription: FunctionComponent<heroProps> = ({hero}: heroProps) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.imgCol} style={{
                    backgroundImage: `url("${hero[0].mainImage}")`
                }}/>
                <div className={styles.textCol}>
                    <h2 className={styles.heading}>
                        {hero[0].heading}
                    </h2>
                    <h3 className={styles.tagline}>
                        {hero[0].tagline}
                    </h3>
                    <div className={styles.description}>
                        {hero[0].text}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroHeadingTaglineDescription;