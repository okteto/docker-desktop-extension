import Ansi from 'ansi-to-react';

type OutputLineProps = {
  line: string
};

function OutputLine({ line = '' }: OutputLineProps) {
  // To avoid https://github.com/nteract/ansi-to-react/issues/28, we pass smaller chunks of
  // output to the ansi-to-react library.
  const chunks = line.length > 500 ? line.match(/.{1,500}/g) : [line];
  return (
    <>
      {chunks?.map((chunk, i) => (
        <Ansi key={`OutputLineChunk-${i}`} linkify>
          {chunk}
        </Ansi>
      ))}
    </>
  );
}

export default OutputLine;