import React, { MutableRefObject } from "react";
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import ReactGA from "react-ga4";
import html2canvas from "html2canvas";

type Properties = {
    node: MutableRefObject<any>
    name: string
    type: string
}

export default function PngDownloadButton({
  node,
  name,
  type,
}: Properties) {
  async function download() {
    if (!node.current) {
      console.error('No element found for PNG export');
      return;
    }

    const element = node.current;
    
    console.log('PNG Export Debug:', {
      element: element,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      tagName: element.tagName,
      children: element.children?.length
    });

    // Send analytics event
    ReactGA.event({
      category: `${name}.${type}`,
      action: "download_png",
      label: `Download PNG used for ${name} ${type}.`,
    });

    try {
      // Detect current theme more accurately
      const htmlElement = document.documentElement;
      const dataTheme = htmlElement.getAttribute('data-theme');
      const bodyStyle = window.getComputedStyle(document.body);
      const backgroundColor = bodyStyle.backgroundColor;
      
      // Check multiple indicators for dark mode
      const isDarkMode = dataTheme === 'dark' || 
                        backgroundColor.includes('rgb(48, 48, 48)') || // dark gray
                        backgroundColor.includes('rgb(18, 18, 18)') || // darker
                        backgroundColor.includes('rgb(33, 33, 33)') || // material dark
                        (dataTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      console.log('Theme detection:', {
        dataTheme,
        backgroundColor,
        isDarkMode,
        systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches
      });
      
      // Create a clone of the element for export
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container for the cloned element
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = element.scrollWidth + 'px';
      tempContainer.style.height = element.scrollHeight + 'px';
      tempContainer.style.overflow = 'visible';
      tempContainer.style.backgroundColor = isDarkMode ? '#303030' : 'white';
      
      // Apply theme to the container if dark mode
      if (isDarkMode) {
        tempContainer.setAttribute('data-theme', 'dark');
      }
      
      // Style the cloned element to show full content
      clonedElement.style.width = element.scrollWidth + 'px';
      clonedElement.style.height = element.scrollHeight + 'px';
      clonedElement.style.overflow = 'visible';
      clonedElement.style.maxWidth = 'none';
      clonedElement.style.maxHeight = 'none';
      
      // Fix text colors in the clone based on theme
      const firstColumnCells = clonedElement.querySelectorAll('td:first-child span.desktop');
      firstColumnCells.forEach((span: Element) => {
        if (isDarkMode) {
          (span as HTMLElement).style.color = '#ffffff';
        } else {
          (span as HTMLElement).style.color = '#000000';
        }
        (span as HTMLElement).style.fontWeight = '500';
      });
      
      // Remove sticky positioning from table header cells
      const headerCells = clonedElement.querySelectorAll('th');
      headerCells.forEach((cell: Element) => {
        (cell as HTMLElement).style.position = 'static';
        (cell as HTMLElement).style.top = '';
        (cell as HTMLElement).style.zIndex = '';
      });

      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = clonedElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      // Generate canvas with html2canvas
      const canvas = await html2canvas(clonedElement, {
        backgroundColor: isDarkMode ? '#303030' : '#ffffff',
        useCORS: true,
        allowTaint: false,
        scale: 1,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      // Clean up the temporary container
      document.body.removeChild(tempContainer);

      // Download the image
      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = canvas.toDataURL();
      link.click();

    } catch (error) {
      console.error('Error generating PNG:', error);
    }
  }

  return (
    <Button
      onClick={download}
      variant="contained"
      startIcon={<Download />}
      sx={{ mb: 2 }}
    >
      Download as PNG
    </Button>
  );
}