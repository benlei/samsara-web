import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Link,
  FormControlLabel,
  Switch,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function Footer({ children }: React.PropsWithChildren) {
  const { theme, setTheme } = useTheme();
  const [themeState, setThemeState] = useState('light');

  useEffect(() => {
    setThemeState(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(themeState === 'dark' ? 'light' : 'dark');
    setThemeState(themeState === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          margin: '5em 0em 0em',
          padding: '5em 0em',
          borderTop: 1,
          borderColor: 'var(--divider)',
          backgroundColor: 'var(--mui-paper-bg)',
          color: 'var(--text-primary)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, textAlign: 'center' }}>
            <Box sx={{ flex: { xs: 1, md: '0 0 33%' } }}>
              <Typography variant="h6" component="h4" gutterBottom>
                Links
              </Typography>
              <List>
                <ListItem
                  component={Link}
                  href="https://github.com/benlei/samsara-web"
                  sx={{ justifyContent: 'center', textDecoration: 'none' }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                    <GitHub />
                  </ListItemIcon>
                  <ListItemText primary="GitHub" />
                </ListItem>
              </List>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={themeState !== 'dark'}
                      onChange={toggleTheme}
                      inputProps={{ 'aria-label': 'theme toggle' }}
                    />
                  }
                  label={themeState !== 'dark' ? 'Light Mode' : 'Dark Mode'}
                />
              </Box>
            </Box>
            <Box sx={{ flex: { xs: 1, md: '0 0 67%' }, textAlign: 'left' }}>
              <Typography variant="h6" component="h4" gutterBottom>
                About
              </Typography>
              <Typography variant="body2" paragraph>
                This hobby site currently does not directly store any data about its users on any
                server. It does, however, store cookies/local storage on your browser - such as for
                Google Analytics, light/dark mode, among other things.
              </Typography>

              <Typography variant="body2" paragraph>
                The data shown here is sourced from the{' '}
                <Link
                  href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Genshin Fandom
                </Link>{' '}
                and{' '}
                <Link
                  href="https://honkai-star-rail.fandom.com/wiki/Honkai:_Star_Rail_Wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HSR Fandom
                </Link>{' '}
                site.
              </Typography>

              <Typography variant="body2" paragraph>
                There may be bugs, so if you think you&apos;ve found one feel free to create a GitHub
                issue! Note that there are currently no plans for localization (I am not a FE
                developer), but if someone wants to set such a system up, feel free to create
                some (small, digestable) PRs!
              </Typography>

              <Typography variant="body2">
                samsara.pages.dev is not affiliated with or endorsed by HoYoverse.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
