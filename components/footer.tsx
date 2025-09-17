import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import { GitHub, LightMode, DarkMode } from "@mui/icons-material";

export default function Footer({ children }: React.PropsWithChildren) {
  const { theme, setTheme, systemTheme } = useTheme();
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const [themeState, setThemeState] = useState("light");

  useEffect(() => {
    setThemeState(effectiveTheme === "dark" ? "dark" : "light");
  }, [effectiveTheme]);

  const toggleTheme = () => {
    const newTheme = themeState === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 6,
        mt: 8,
        borderTop: 1,
        borderColor: "divider",
        // Force dark colors for dark mode to override theme
        '@media (prefers-color-scheme: dark)': {
          '&:not([data-theme="light"] *)': {
            bgcolor: 'hsl(0, 2%, 18.0%) !important',
            borderColor: 'rgba(255, 255, 255, 0.12) !important',
            color: 'rgba(255, 255, 255, 0.87) !important',
          }
        },
        // Explicit theme overrides
        '[data-theme="dark"] &': {
          bgcolor: 'hsl(0, 2%, 18.0%) !important',
          borderColor: 'rgba(255, 255, 255, 0.12) !important',
          color: 'rgba(255, 255, 255, 0.87) !important',
        },
        '[data-theme="light"] &': {
          bgcolor: '#f5f5f5 !important',
          borderColor: 'rgba(0, 0, 0, 0.12) !important',
          color: 'rgba(0, 0, 0, 0.87) !important',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: { xs: 1, md: '0 0 33%' } }}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            <List dense>
              <ListItem
                component={Link}
                href="https://github.com/benlei/samsara-web"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  p: 0, 
                  color: "inherit", 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <GitHub fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="GitHub Repository" />
              </ListItem>
            </List>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={themeState === "dark"}
                    onChange={toggleTheme}
                    icon={<LightMode />}
                    checkedIcon={<DarkMode />}
                  />
                }
                label={themeState === "dark" ? "Dark Mode" : "Light Mode"}
              />
            </Box>
          </Box>

          <Box sx={{ flex: { xs: 1, md: '0 0 67%' } }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              This hobby site currently does not directly store any data about its users on any
              server. It does, however, store cookies/local storage on your browser - such as for
              Google Analytics, light/dark mode, among other things.
            </Typography>

            <Typography variant="body2" paragraph color="text.secondary">
              The data shown here is sourced from the{" "}
              <Link
                href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                Genshin Fandom
              </Link>{" "}
              and{" "}
              <Link
                href="https://honkai-star-rail.fandom.com/wiki/Honkai:_Star_Rail_Wiki"
                target="_blank"
                rel="noopener noreferrer"
              >
                HSR Fandom
              </Link>{" "}
              sites.
            </Typography>

            <Typography variant="body2" paragraph color="text.secondary">
              There may be bugs, so if you think you&apos;ve found one feel free to create a GitHub
              issue! Note that there are currently no plans for localization (I am not a FE
              developer), but if someone wants to set such a system up, feel free to create
              some (small, digestible) PRs!
            </Typography>

            <Typography variant="body2" color="text.secondary">
              samsara.pages.dev is not affiliated with or endorsed by HoYoverse.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" display="block" textAlign="center" color="text.secondary">
          © {new Date().getFullYear()} Samsara. Made with ❤️ for the Genshin Impact and Honkai: Star Rail community.
        </Typography>
      </Container>
    </Box>
  );
}
