import { useRouter } from "next/router";
import React from "react";
import {
  Accordion,
  Container,
  Icon,
  Image,
  Menu,
  Sidebar,
} from "semantic-ui-react";
import { getImageFromName } from "../format/image";

type SidebarItemsProps = {
  stars: 5 | 4;
  type: "characters" | "weapons" | "hsr-characters" | "lightcones";
};

const FiveStarChar = "/5star/c";
const FiveStarWeap = "/5star/w";
const FourStarChar = "/4star/c";
const FourStarWeap = "/4star/w";

const FiveStarHSRChar = "/5star/hsr-c";
const FiveStarHSRWeap = "/5star/l";
const FourStarHSRChar = "/4star/hsr-c";
const FourStarHSRWeap = "/4star/l";

type SidebarPusherProperties = {
  direction: "left" | "right";
  characterName: string;
  characterType: "characters" | "hsr-characters";
  weaponName: string;
  weaponType: "weapons" | "lightcones";
  fiveStarCharBase: string;
  fiveStarWeapBase: string;
  fourStarCharBase: string;
  fourStarWeapBase: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
};

function SidebarPusher({
  title,
  direction,
  characterName,
  characterType,
  weaponName,
  weaponType,
  fiveStarCharBase,
  fiveStarWeapBase,
  fourStarCharBase,
  fourStarWeapBase,
  visible,
  setVisible,
}: SidebarPusherProperties): JSX.Element {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = React.useState(router.pathname);

  function handleActiveMenu(newActiveMenu: string) {
    if (activeMenu === newActiveMenu) {
      return;
    }

    setActiveMenu(newActiveMenu);
  }

  // ok to keep similar logic for hsr
  function in5StarChar() {
    return (
      activeMenu.startsWith(fiveStarCharBase) ||
      (!in5StarWeap() && !in4StarWeap() && !in4StarChar())
    );
  }

  function in4StarChar() {
    return activeMenu.startsWith(fourStarCharBase);
  }

  function in5StarWeap() {
    return activeMenu.startsWith(fiveStarWeapBase);
  }

  function in4StarWeap() {
    return activeMenu.startsWith(fourStarWeapBase);
  }

  return (
    <Sidebar.Pusher>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        onHide={() => setVisible(false)}
        vertical
        direction={direction}
        visible={visible}
      >
        <Menu.Item>
          <Menu.Header className={"logo"} as={"a"} href={"/"}>
            <Image
              src={"/images/logo.png"}
              alt={"logo"}
              floated={"left"}
              size={"mini"}
            />{" "}
            Samsara
          </Menu.Header>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>
            <Image
              size="medium"
              src={`/images/${getImageFromName(title.toLowerCase())}-logo.webp`}
              alt={title}
            />
          </Menu.Header>
        </Menu.Item>
        <Accordion>
          <Accordion.Title
            active={in5StarChar()}
            onClick={() => handleActiveMenu(fiveStarCharBase)}
            as={Menu.Item}
          >
            <Menu.Header>
              <Icon name="dropdown" /> 5&#x2605; {characterName}
            </Menu.Header>
          </Accordion.Title>
          <Accordion.Content active={in5StarChar()}>
            <SidebarMenuItems stars={5} type={characterType} />
          </Accordion.Content>

          <Accordion.Title
            active={in5StarWeap()}
            onClick={() => handleActiveMenu(fiveStarWeapBase)}
            as={Menu.Item}
          >
            <Menu.Header>
              <Icon name="dropdown" /> 5&#x2605; {weaponName}
            </Menu.Header>
          </Accordion.Title>
          <Accordion.Content active={in5StarWeap()}>
            <SidebarMenuItems stars={5} type={weaponType} />
          </Accordion.Content>

          <Accordion.Title
            active={in4StarChar()}
            onClick={() => handleActiveMenu(fourStarCharBase)}
            as={Menu.Item}
          >
            <Menu.Header>
              <Icon name="dropdown" /> 4&#x2605; {characterName}
            </Menu.Header>
          </Accordion.Title>
          <Accordion.Content active={in4StarChar()}>
            <SidebarMenuItems stars={4} type={characterType} />
          </Accordion.Content>

          <Accordion.Title
            active={in4StarWeap()}
            onClick={() => handleActiveMenu(fourStarWeapBase)}
            as={Menu.Item}
          >
            <Menu.Header>
              <Icon name="dropdown" /> 4&#x2605; {weaponName}
            </Menu.Header>
          </Accordion.Title>
          <Accordion.Content active={in4StarWeap()}>
            <SidebarMenuItems stars={4} type={weaponType} />
          </Accordion.Content>
        </Accordion>
      </Sidebar>
    </Sidebar.Pusher>
  );
}

export default function Navbar(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [hsrVisible, setHsrVisible] = React.useState(false);

  return (
    <>
      <Container style={{ marginTop: ".5em" }}>
        <Menu secondary className={"navmenu"}>
          <Menu.Item as={"a"} href="/" className={"navtitle"}>
            Samsara
          </Menu.Item>
          <Menu.Item as={"a"} onClick={() => setVisible(!visible)}>
            <Icon name={"bars"} /> Genshin
          </Menu.Item>
          <Menu.Item as={"a"} onClick={() => setHsrVisible(!hsrVisible)}>
            <Icon name={"bars"} /> HSR
          </Menu.Item>
        </Menu>
      </Container>

      <SidebarPusher
        title={"Genshin Impact"}
        direction={"left"}
        characterName={"Characters"}
        characterType={"characters"}
        weaponName={"Weapons"}
        weaponType={"weapons"}
        fiveStarCharBase={FiveStarChar}
        fiveStarWeapBase={FiveStarWeap}
        fourStarCharBase={FourStarChar}
        fourStarWeapBase={FourStarWeap}
        visible={visible}
        setVisible={setVisible}
      />

      <SidebarPusher
        title={"Honkai: Star Rail"}
        direction={"left"}
        characterName={"Characters"}
        characterType={"hsr-characters"}
        weaponName={"Lightcones"}
        weaponType={"lightcones"}
        fiveStarCharBase={FiveStarHSRChar}
        fiveStarWeapBase={FiveStarHSRWeap}
        fourStarCharBase={FourStarHSRChar}
        fourStarWeapBase={FourStarHSRWeap}
        visible={hsrVisible}
        setVisible={setHsrVisible}
      />
    </>
  );
}

function SidebarMenuItems({ stars, type }: SidebarItemsProps): JSX.Element {
  return (
    <Menu vertical>
      <Menu.Item as={"a"} href={`/${stars}star/${type}`}>
        Banner History
      </Menu.Item>
      <Menu.Item as={"a"} href={`/${stars}star/${type}/summary`}>
        Summary
      </Menu.Item>
      <Menu.Item as={"a"} href={`/${stars}star/${type}/runs`}>
        Total Reruns
      </Menu.Item>
      <Menu.Item as={"a"} href={`/${stars}star/${type}/summary-avg`}>
        Average Reruns
      </Menu.Item>
      <Menu.Item as={"a"} href={`/${stars}star/${type}/longest-leaderboard`}>
        Leaderboard: Longest Rerun
      </Menu.Item>
      <Menu.Item as={"a"} href={`/${stars}star/${type}/shortest-leaderboard`}>
        Leaderboard: Shortest Rerun
      </Menu.Item>
    </Menu>
  );
}
