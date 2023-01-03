import React, {useEffect, useState} from "react";
import Head from "next/head";
import {RotationStorage} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/presets";
import ArtifactRotationPresets from "@/components/artifacts/ArtifactRotationPresets";
import _ from "lodash";
import {v4} from "uuid";


export default function ManageArtifactRotationPresets({}) {
    const [storage, setStorage] = useState<RotationStorage>({
        active: 0,
        cacheId: '',
        presets: []
    })


    useEffect(() => {
        function loadRotationStorage() {
            try {
                const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "null")

                if (_.isNil(rotationStorage?.active)) {
                    return
                }

                if (rotationStorage.cacheId != storage.cacheId) {
                    setStorage((oldStorage) => rotationStorage)
                }
            } catch (ignore) {

            }
        }

        loadRotationStorage()

        const interval = setInterval(() => loadRotationStorage(), 1000);

        return () => clearInterval(interval);
    }, [storage])

    function setStorageAndCommit(newStorage: RotationStorage) {
        try {
            const rotationStorage: RotationStorage | null = JSON.parse(localStorage.getItem(V1StorageKey) || "null")

            // how'd u get in here? ;)
            if (storage.cacheId != '' && rotationStorage?.cacheId != storage.cacheId) {
                return
            }
        } catch (ignore) {

        }
        newStorage.cacheId = v4()
        setStorage(newStorage)
        localStorage.setItem(V1StorageKey, JSON.stringify(newStorage))
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