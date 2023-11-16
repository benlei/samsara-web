import React, { ChangeEvent } from "react";
import { Icon, InputOnChangeData, Table } from "semantic-ui-react";
import { VersionParts } from "@/banners/types";
import HistorySearch from "./HistorySearch";

type Properties = {
  versionParts: VersionParts[];
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
};

export default function HistoryHeader({ onChange, versionParts }: Properties) {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          className={"borderless"}
          style={{ pointerEvents: "auto", padding: "0 .5em" }}
        >
          <HistorySearch onChange={onChange} />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Icon name="redo" />
        </Table.HeaderCell>
        {versionParts.map(function (vp, idx) {
          return (
            <Table.HeaderCell colSpan={vp.parts} key={idx}>
              {vp.version}
            </Table.HeaderCell>
          );
        })}
      </Table.Row>
    </Table.Header>
  );
}
