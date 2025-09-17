import { useRouter } from "next/router";
import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  StarBorder,
} from "@mui/icons-material";
import { getImageFromName } from "../format/image";
import Image from "next/image";

// Import the favicon ICO directly
const SamsaraIcon = ({ sx }: { sx?: any }) => (
  <Box
    component="img"
    src="/favicon.ico"
    alt="Samsara"
    sx={{
      width: '1em',
      height: '1em',
      display: 'inline-block',
      fontSize: 'inherit',
      ...sx,
    }}
  />
);

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

function SidebarDrawer({
  title,
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
}: SidebarPusherProperties): React.ReactElement {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = React.useState(router.pathname);
  
  // Function to determine which section should be expanded based on current path
  const getExpansionState = React.useCallback(() => {
    // Use asPath to get the actual URL instead of the dynamic route template
    const currentPath = router.asPath;
    
    // Determine if this is for Genshin or HSR based on the sidebar type
    const isGenshin = characterType === 'characters' && weaponType === 'weapons';
    const isHSR = characterType === 'hsr-characters' && weaponType === 'lightcones';
    
    if (isGenshin) {
      const isFiveStarChar = currentPath.startsWith('/5star/characters');
      const isFourStarChar = currentPath.startsWith('/4star/characters');
      const isFiveStarWeap = currentPath.startsWith('/5star/weapons');
      const isFourStarWeap = currentPath.startsWith('/4star/weapons');
      
      // If none match, default to 5★ Characters
      const hasMatch = isFiveStarChar || isFourStarChar || isFiveStarWeap || isFourStarWeap;
      
      return {
        openFiveStar: isFiveStarChar || (!hasMatch),
        openFourStar: isFourStarChar,
        openFiveStarWeap: isFiveStarWeap,
        openFourStarWeap: isFourStarWeap
      };
    } else if (isHSR) {
      const isFiveStarChar = currentPath.startsWith('/5star/hsr-characters');
      const isFourStarChar = currentPath.startsWith('/4star/hsr-characters');
      const isFiveStarWeap = currentPath.startsWith('/5star/lightcones');
      const isFourStarWeap = currentPath.startsWith('/4star/lightcones');
      
      // If none match, default to 5★ Characters
      const hasMatch = isFiveStarChar || isFourStarChar || isFiveStarWeap || isFourStarWeap;
      
      return {
        openFiveStar: isFiveStarChar || (!hasMatch),
        openFourStar: isFourStarChar,
        openFiveStarWeap: isFiveStarWeap,
        openFourStarWeap: isFourStarWeap
      };
    }
    
    // Default fallback
    return {
      openFiveStar: true,
      openFourStar: false,
      openFiveStarWeap: false,
      openFourStarWeap: false
    };
  }, [router.asPath, characterType, weaponType]);
  
  // Initialize expansion state based on current route
  const [openFiveStar, setOpenFiveStar] = React.useState(() => getExpansionState().openFiveStar);
  const [openFourStar, setOpenFourStar] = React.useState(() => getExpansionState().openFourStar);
  const [openFiveStarWeap, setOpenFiveStarWeap] = React.useState(() => getExpansionState().openFiveStarWeap);
  const [openFourStarWeap, setOpenFourStarWeap] = React.useState(() => getExpansionState().openFourStarWeap);

  // Update expansion state when sidebar becomes visible or route changes
  React.useEffect(() => {
    if (visible) {
      const expansionState = getExpansionState();
      setOpenFiveStar(expansionState.openFiveStar);
      setOpenFourStar(expansionState.openFourStar);
      setOpenFiveStarWeap(expansionState.openFiveStarWeap);
      setOpenFourStarWeap(expansionState.openFourStarWeap);
    }
  }, [visible, getExpansionState]);

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
    <Drawer
      anchor="left"
      open={visible}
      onClose={() => setVisible(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, pl: 2 }}>
          <Typography 
            variant="h5"
            sx={{
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: '0.8px',
              fontSize: '1.4rem',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              transition: 'color 0.3s ease',
            }}
          >
            <SamsaraIcon 
              sx={{ 
                fontSize: '1.8rem',
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                },
                transition: 'color 0.3s ease',
              }} 
            />
            SAMSARA
          </Typography>
        </Box>
        <ListItem>
          <Image
            src={`/images/${getImageFromName(title.toLowerCase())}-logo.webp`}
            alt={title}
            width={120}
            height={40}
          />
        </ListItem>
        <Divider />
      </Box>

      <List>
        <ListItemButton onClick={() => setOpenFiveStar(!openFiveStar)}>
          <ListItemText primary={`5★ ${characterName}`} />
          {openFiveStar ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFiveStar} timeout="auto" unmountOnExit>
          <SidebarMenuItems stars={5} type={characterType} />
        </Collapse>

        <ListItemButton onClick={() => setOpenFiveStarWeap(!openFiveStarWeap)}>
          <ListItemText primary={`5★ ${weaponName}`} />
          {openFiveStarWeap ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFiveStarWeap} timeout="auto" unmountOnExit>
          <SidebarMenuItems stars={5} type={weaponType} />
        </Collapse>

        <ListItemButton onClick={() => setOpenFourStar(!openFourStar)}>
          <ListItemText primary={`4★ ${characterName}`} />
          {openFourStar ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFourStar} timeout="auto" unmountOnExit>
          <SidebarMenuItems stars={4} type={characterType} />
        </Collapse>

        <ListItemButton onClick={() => setOpenFourStarWeap(!openFourStarWeap)}>
          <ListItemText primary={`4★ ${weaponName}`} />
          {openFourStarWeap ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openFourStarWeap} timeout="auto" unmountOnExit>
          <SidebarMenuItems stars={4} type={weaponType} />
        </Collapse>
      </List>
    </Drawer>
  );
}

export default function Navbar(): React.ReactElement {
  const [visible, setVisible] = React.useState(false);
  const [hsrVisible, setHsrVisible] = React.useState(false);

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg" disableGutters>
          <Toolbar sx={{ justifyContent: "space-between", minHeight: "48px", px: 2 }}>
            <Button 
              href="/" 
              sx={{ 
                fontSize: "1.3rem", 
                fontWeight: 600,
                color: 'inherit',
                letterSpacing: '0.8px',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                textTransform: 'none',
                ml: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                transition: 'color 0.3s ease',
              }}
            >
              <SamsaraIcon 
                sx={{ 
                  fontSize: '1.6rem',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.dark',
                  },
                  transition: 'color 0.3s ease',
                }} 
              />
              SAMSARA
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<MenuIcon />}
                onClick={() => setVisible(!visible)}
              >
                Genshin
              </Button>
              <Button
                color="inherit"
                startIcon={<MenuIcon />}
                onClick={() => setHsrVisible(!hsrVisible)}
              >
                HSR
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <SidebarDrawer
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

      <SidebarDrawer
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

function SidebarMenuItems({ stars, type }: SidebarItemsProps): React.ReactElement {
  return (
    <List sx={{ pl: 4 }}>
      <ListItemButton component="a" href={`/${stars}star/${type}`}>
        <ListItemText primary="Banner History" />
      </ListItemButton>
      <ListItemButton component="a" href={`/${stars}star/${type}/summary`}>
        <ListItemText primary="Summary" />
      </ListItemButton>
      <ListItemButton component="a" href={`/${stars}star/${type}/runs`}>
        <ListItemText primary="Total Reruns" />
      </ListItemButton>
      <ListItemButton component="a" href={`/${stars}star/${type}/summary-avg`}>
        <ListItemText primary="Average Reruns" />
      </ListItemButton>
      <ListItemButton component="a" href={`/${stars}star/${type}/longest-leaderboard`}>
        <ListItemText primary="Leaderboard: Longest Rerun" />
      </ListItemButton>
      <ListItemButton component="a" href={`/${stars}star/${type}/shortest-leaderboard`}>
        <ListItemText primary="Leaderboard: Shortest Rerun" />
      </ListItemButton>
    </List>
  );
}
