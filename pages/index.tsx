import React, { FunctionComponent, ReactNode, useEffect, useState} from "react";

import {Container, Header, Footer} from "@components";
import {GetStaticProps} from "next";
import Fuse from "fuse.js"
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

    return (
        <Container>
            <Head>
                <title>Joseph Simpson - Full Stack Developer</title>
                <link rel='icon' href='/favicon.ico'/>
            </Head>
            <Header/>
            <div className="wrapper">
                <Projects
                    visibleProjects={visibleProjects}
                    tagState={tagState}
                    clickableTagState={clickableTagState}
                    handleTagClick={handleTagClick}
                    handleTagReset={handleTagReset}
                    handleSearch={handleSearch}
                    handleSearchClear={handleSearchClear}
                    searchValue={searchValue}
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


