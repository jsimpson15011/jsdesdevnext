import React from "react";
import Link from "next/link"

import styles from "./header.module.css"

export const Header: React.FC = () => {
  return (
    <div className={styles.header}  data-test="main-header">
        <nav className={styles.nav}>
            <div className={styles.navWrapper}>
                <Link href="/">
                        <img className={styles.logo} alt="" src="/images/bracket-logo.png"/>
                </Link>
            </div>
        </nav>
        <h1 className={styles.title}>
            Joseph Simpson
            <span className={styles.subTitle}>
                Full Stack Developer
            </span>
        </h1>
    </div>
  );
};
