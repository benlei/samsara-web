import React, {useEffect, useState} from "react";
import Head from "next/head";
import {RotationStorage} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/rotations";
import ArtifactRotationPresets from "@/components/artifacts/ArtifactRotationPresets";


export default function ManageArtifactRotationPresets({}) {
    const [storage, setStorage] = useState({})

    useEffect(() => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (!rotationStorage.active) {
                return
            }

            setStorage(rotationStorage)
        } catch (ignore) {

        }
    }, [])

    return (
        <>
            <Head>
                <title>Presets for Artifact Rotations - Samsara</title>
            </Head>

            <ArtifactRotationPresets
                storage={storage}
                setStorage={setStorage}
            />
        </>
    )
}