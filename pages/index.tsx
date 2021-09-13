import React, {FunctionComponent, ReactNode, useEffect, useState} from "react";

import {Container, Header, Main, Footer, Cards} from "@components";
import {GetStaticProps} from "next";
import client, {
    getClient,
    usePreviewSubscription,
    PortableText,
} from "@lib/sanity"
import {useRouter} from "next/router";
import {groq} from "next-sanity";

type homeProps = {
    projectData: any,
    tagsData: any,
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

    const initialProjects = projects.map((projects: any) => {
        return (
            {
                ...projects,
                isVisible: true
            }
        )
    })

    const initialClickableTags = new Set();

    projects.forEach((project: any) => {
        project.tags.forEach((tag: tag) => {
            initialClickableTags.add(tag._id)
        })
    })

    type tag = {
        _id: string,
        title: string,
        isActive: boolean,
        isVisible: boolean
    }

    const [tagState, updateTags] = useState(initialTags)
    const [projectState, updateProjects] = useState(initialProjects)
    const [clickableTagState, updateClickableTags] = useState(initialClickableTags)

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

    useEffect(() => {
        handleProjectUpdate()
    }, [tagState])

    useEffect(() => {
        const updatedClickableTags = new Set();

        projectState.forEach((project: any) => {
            if (project.isVisible) {
                project.tags.forEach((tag: tag) => {
                    updatedClickableTags.add(tag._id)
                })
            }
        })

        updateClickableTags(updatedClickableTags)
    }, [projectState])

    function handleProjectUpdate() {
        const activeTagSet = new Set();

        tagState.forEach((tag: tag) => {
            if (tag.isActive) {
                activeTagSet.add(tag._id)
            }
        })

        const updatedProjects = projectState.map((currProject: any) => {
            const projectTagSet = new Set();
            let isVisible = true

            currProject.tags.forEach((tag: tag) => {
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

        if(tag.isActive)
        {
            currStyle = activeTagStyle as never
        }

        if(!isClickable)
        {
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

    const projectComponents = projectState.map(((project: any) => {
        if (project.isVisible) {
            return (
                <div key={project._id}>
                    <h2>{project.title}</h2>
                    <div className="tag-container">
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
            )
        }

    }))


    return (
        <Container>
            <Header/>
            {tagFilterButtons}
            {projectComponents}
            <Main/>
            <Footer/>
        </Container>
    );
};

const query = groq`
*[_type == "project"] | order(_createdAt desc) {
 _id, title,...,
 tags[]->
}
`;

const tagsQuery = groq`
*[_type == "projectTag"] | order(_createdAt desc) {
 _id,
 title
}
`;

export const getStaticProps: GetStaticProps = async ({params, preview = false}) => {
    const projects = await getClient(preview).fetch(query);
    const tags = await getClient(preview).fetch(tagsQuery);

    return {
        props: {
            projectData: projects,
            tagsData: tags,
            preview,
        },
        revalidate: 10
    }
}


export default Home;


