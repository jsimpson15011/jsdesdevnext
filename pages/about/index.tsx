import React, { FunctionComponent } from "react";

import {Container, Header, Footer} from "@components";

const About: FunctionComponent = () => {

    return (
        <Container>
            <Header/>
            <div className="wrapper">

            </div>
            <Footer/>
        </Container>
    );
};


/*export const getStaticProps: GetStaticProps = async (context) => {
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
}*/


export default About;