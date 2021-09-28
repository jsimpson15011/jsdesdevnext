import React from "react";
import Link from "next/link"

import styles from "./header.module.css"

export const Header: React.FC = () => {
  return (
    <div className={styles.header}  data-test="main-header">
        <div className={styles.nav}>
            <div className={styles.navWrapper}>
                <div className={styles.navRow}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/about">
                        <a>About</a>
                    </Link>
                    <Link href="/projects">
                        <a>Projects</a>
                    </Link>
                </div>
                <Link href="/">
                    <a>
                        <img alt="" src="/images/js-logo.png"/>
                    </a>
                </Link>
                <div className={styles.navRow}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/about">
                        <a>About</a>
                    </Link>
                    <Link href="/projects">
                        <a>Projects</a>
                    </Link>
                </div>
            </div>
        </div>
        <h1 className={styles.title}>
            Joseph Simpson
            <span className={styles.subTitle}>
                Full Stack Developer
            </span>
        </h1>
    </div>
  );
};
