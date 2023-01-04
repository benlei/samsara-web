import React, {useEffect, useState} from "react";
import Head from "next/head";
import {RotationStorage} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/presets";
import ArtifactRotationPresets from "@/components/artifacts/ArtifactRotationPresets";
import _ from "lodash";
import Stale from "@/components/Stale";
import ArtifactConfigLoadDownload from "@/components/artifacts/ArtifactConfigLoadDownload";
import {nanoid} from "nanoid";


export default function ManageArtifactRotationPresets({}) {
    const [storage, setStorage] = useState<RotationStorage>({
        active: 0,
        cacheId: '',
        presets: []
    })

    const [stale, setStale] = useState(false)


    useEffect(() => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (_.isNil(rotationStorage?.active)) {
                return
            }

            if (rotationStorage.cacheId != storage.cacheId) {
                setStorage((oldStorage) => rotationStorage)
            }
        } catch (ignore) {

        }
    }, [storage])

    function setStorageAndCommit(newStorage: RotationStorage) {
        try {
            const rotationStorage: RotationStorage | null = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (storage.cacheId != '' && rotationStorage?.cacheId != storage.cacheId) {
                setStale(true)
                return
            }
        } catch (ignore) {

        }
        newStorage.cacheId = nanoid()
        setStorage(newStorage)
        localStorage.setItem(V1StorageKey, JSON.stringify(newStorage))
    }

    return (
        <>
            <Head>
                <title>Presets for Artifact Rotations - Samsara</title>
            </Head>

            {stale ? (
                <Stale/>
            ) : (
                <>
                    <ArtifactConfigLoadDownload
                        setStorage={setStorageAndCommit}
                    />

                    <ArtifactRotationPresets
                        storage={storage}
                        setStorage={setStorageAndCommit}
                    />
                </>
            )}
        </>
    )
}