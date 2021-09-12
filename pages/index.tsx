import React, {FunctionComponent, ReactNode} from "react";

import { Container, Header, Main, Footer, Cards } from "@components";
import {GetStaticProps} from "next";
import client, {
    getClient,
    usePreviewSubscription,
    PortableText,
} from "@lib/sanity"
import {useRouter} from "next/router";
import {groq} from "next-sanity";
import {forEach} from "iterall";

type homeProps = {
    postData: any,
    preview: boolean,
    children?: ReactNode
}

const Home: FunctionComponent<homeProps> = (props : homeProps) => {
    const { postData, preview } = props;

    const router = useRouter();

    const { data: posts } = usePreviewSubscription(query, {
        initialData: postData,
        enabled: preview || router.query.preview !== undefined,
    });

    console.log(posts)
    posts.forEach((el: { tags: any; }) => console.log(el.tags))

    return (
        <Container>
            <Header />
            <Main />
            <Footer />
        </Container>
    );
};

const query = groq`
*[_type == "project"] | order(_createdAt desc) {
 _id, title,...,
 tags[]->
}
`;

export const getStaticProps: GetStaticProps = async ({ params, preview = false}) => {
    const post = await getClient(preview).fetch(query);

    return {
        props: {
            postData: post,
            preview,
        },
        revalidate: 10
    }
}


export default Home;


