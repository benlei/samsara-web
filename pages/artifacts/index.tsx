import React from "react";


// TODO: make this page instead show all the "show on overview" presets

export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

export default function ArtifactRotationsOverview() {
    return null
}