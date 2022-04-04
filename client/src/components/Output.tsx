import { useEffect, useRef, useMemo } from 'react';
import { Box } from '@mui/material';
import OutputLine from './OutputLine';

type OutputProps = {
  output: string
};

const convertOutput = (output: string): Array<string> => {
  return output
    .split('\n')
    .map(outputLine => outputLine.replace(/^.*\[K/, '')); // Take into account the erase line char.
};

function Output({ output }: OutputProps) {
  const scrollable = useRef<HTMLDivElement | null>(null);
  const lines = useMemo(() => {
    return convertOutput(output);
  }, [output]);

  useEffect(() => {
    scrollable?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        px: 3,
        py: 2,
        bgcolor: '#101010',
        color: 'grey.300',
        border: '0',
        borderRadius: 1,
        boxShadow: 1,
        fontSize: '0.8rem',
        fontWeight: 'normal',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
    >
      {lines.map((line, i) => (
        <OutputLine key={`Line-${i}`} line={line} />
      ))}
      <div ref={scrollable} />
    </Box>
  );
}

export default Output;