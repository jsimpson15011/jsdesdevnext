import React, { FunctionComponent, ReactNode } from "react";

import {Container, Header, Footer} from "@components";
import {GetStaticProps} from "next";
import {
    getClient,
    usePreviewSubscription,
} from "@lib/sanity"
import {useRouter} from "next/router";
import {groq} from "next-sanity";
import Projects from "@components/projects";
import {project, tag} from "@components/projects/types"
import Head from "next/head"

type homeProps = {
    projectData: project[],
    tagsData: tag[],
    preview: boolean,
    children?: ReactNode
}

const Home: FunctionComponent<homeProps> = (props: homeProps) => {
    const {projectData, preview, tagsData} = props;
    /*
    * Todo I think all state should be transferred over to redux at some point
    * */
    const router = useRouter();

    const {data: projects} = usePreviewSubscription(query, {
        initialData: projectData,
        enabled: preview || router.query.preview !== undefined,
    });

    const {data: tags} = usePreviewSubscription(query, {
        initialData: tagsData,
        enabled: preview || router.query.preview !== undefined,
    });

    return (
        <Container>
            <Head>
                <title>Joseph Simpson - Full Stack Developer</title>
                <link rel='icon' href='/favicon.ico'/>
            </Head>
            <Header/>
            <div className="wrapper">
                <Projects
                    tags={tags}
                    projects={projects}
                />
            </div>
            <Footer/>
        </Container>
    );
};

const query = groq`
*[_type == "project"] | order(_createdAt desc) {
 _id, title,
 description,
 subTitle,
 externalUrl,
 "mainImage": image.asset->url,
 "backgroundImage": backgroundImage.asset->url,
 tags[]->
}
`;

const tagsQuery = groq`
*[_type == "projectTag"] | order(title asc) {
 _id,
 title
}
`;

export const getStaticProps: GetStaticProps = async (context) => {
    const projects = await getClient(context.preview).fetch(query);
    const tags = await getClient(context.preview).fetch(tagsQuery);
    const preview = context.preview || null

    return {
        props: {
            projectData: projects,
            tagsData: tags,
            preview
        },
        revalidate: 10
    }
}


export default Home;


