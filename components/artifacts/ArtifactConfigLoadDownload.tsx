import {Button, Container, Form, Message} from "semantic-ui-react";
import React, {useRef, useState} from "react";
import {V1StorageKey} from "@/artifacts/presets";
import {Rotation, RotationPreset, RotationStorage} from "@/artifacts/types";

type Properties = {
    setStorage: (storage: RotationStorage) => any
}

export default function ArtifactConfigLoadDownload(
    {
        setStorage,
    }: Properties
) {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    function downloadHandler() {
        const dataStr = 'data:application/json;charset=utf-8,'
            + encodeURIComponent(localStorage.getItem(V1StorageKey) || "{}");
        const download = document.createElement('a');
        download.setAttribute('href', dataStr);
        download.setAttribute('download', 'presets.samsara.json');
        document.body.appendChild(download);
        download.click();
        download.remove();
    }

    function loadUploadedStorage(data: any) {
        setError("")
        setSuccess("")

        try {
            const storage: RotationStorage = {
                active: Math.min(0, Math.max(data.active, 0)),
                cacheId: data.cacheId,
                presets: [],
            }

            for (const preset of (data.presets as RotationPreset[])) {
                const newPreset = {
                    name: preset.name,
                    fixed: preset.fixed,
                    fixedDays: preset.fixedDays,
                    date: preset.date,
                    rotations: [] as Rotation[],
                }

                for (const rotation of preset.rotations) {
                    newPreset.rotations.push({
                        domain: rotation.domain,
                        characters: [...rotation.characters],
                        days: rotation.days,
                        note: rotation.note,
                    })
                }
                storage.presets.push(newPreset)
            }

            setStorage(storage)
            setSuccess("Loaded!\n" +
                "If for some reason something breaks, you can google 'how to clear local storage for BROWSER', " +
                "where BROWSER is the actual name of your browser.")
        } catch (err) {
            setError("Could not parse preset data.")
        }
    }

    async function uploadHandler(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()

        if (event.target?.files?.[0]) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    loadUploadedStorage(JSON.parse(e.target?.result?.toString() ?? "{}"))
                } catch (error) {
                    setError("Could not read uploaded file.")
                    setSuccess("")
                }
            }

            reader.readAsText(event.target.files[0])
        }
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <Container style={{marginTop: '2em'}} textAlign={"center"}>
            {error &&
                <Message negative>
                    {error.split("\n").map((s, k) =>
                        <p key={k}>{s}</p>
                    )}
                </Message>
            }
            {success &&
                <Message positive>
                    {success.split("\n").map((s, k) =>
                        <p key={k}>{s}</p>
                    )}
                </Message>
            }
            <Form style={{marginTop: '2em'}}>
                <Form.Group widths={"equal"} inline>
                    <Form.Field>
                        <Button content='Download' icon='download' labelPosition='left' onClick={downloadHandler}/>
                    </Form.Field>
                    <Form.Field>
                        <Button content='Load' icon='upload' labelPosition='right'
                                onClick={() => fileInputRef?.current?.click?.()}/>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{display: 'none'}}
                            onChange={uploadHandler}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        </Container>
    )
}