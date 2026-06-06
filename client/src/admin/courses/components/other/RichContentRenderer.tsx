import React from 'react';
import parse, {Element, type HTMLReactParserOptions } from 'html-react-parser';
import { Box, type SxProps } from '@mui/material';
import DynamicRechart from './DynamicRechart';
import type { Theme } from '@emotion/react';

interface RichContentRendererProps {
  html: string;
  sx?: SxProps<Theme>; // Accept the custom styles from your course page parent layout
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ html, sx }) => {
  
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Intercept the dynamic chart node wrapper
      if (domNode instanceof Element && domNode.attribs['data-type'] === 'chart') {
        const attribs = domNode.attribs;

        let chartData = [];
        let chartKeys = [];
        let chartColors = [];

        try {
          chartData = attribs['data-data'] ? JSON.parse(attribs['data-data']) : [];
          chartKeys = attribs['data-keys'] ? JSON.parse(attribs['data-keys']) : [];
          chartColors = attribs['data-colors'] ? JSON.parse(attribs['data-colors']) : [];
        } catch (e) {
          console.error("Error parsing chart component structural payload JSON:", e);
        }

        return (
          <DynamicRechart
            type={attribs['data-chart-type'] || 'bar'}
            title={attribs['data-title'] || 'Chart'}
            data={chartData}
            keys={chartKeys}
            labelKey={attribs['data-label-key'] || 'label'}
            colors={chartColors}
            width={attribs['data-width'] ? parseInt(attribs['data-width']) : 600}
            height={attribs['data-height'] ? parseInt(attribs['data-height']) : 300}
          />
        );
      }
    },
  };

  // We assign the custom typography and HTML styles directly to this Box wrapper component
  return (
    <Box sx={sx}>
      {parse(html, options)}
    </Box>
  );
};

export default RichContentRenderer;