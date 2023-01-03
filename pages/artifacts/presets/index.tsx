import React, {useEffect, useState} from "react";
import Head from "next/head";
import {RotationStorage} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/presets";
import ArtifactRotationPresets from "@/components/artifacts/ArtifactRotationPresets";
import _ from "lodash";


export default function ManageArtifactRotationPresets({}) {
    const [storage, setStorage] = useState<RotationStorage>({
        active: 0,
        presets: []
    })

    useEffect(() => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "null")

            if (_.isNil(rotationStorage?.active)) {
                return
            }

            setStorage(rotationStorage)
        } catch (ignore) {

        }
    }, [])

    function setStorageAndCommit(storage: RotationStorage) {
        setStorage(storage)
        localStorage.setItem(V1StorageKey, JSON.stringify(storage))
    }

    return (
        <>
            <Head>
                <title>Presets for Artifact Rotations - Samsara</title>
            </Head>

            <ArtifactRotationPresets
                storage={storage}
                setStorage={setStorageAndCommit}
            />
        </>
    )
}