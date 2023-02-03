import { FC, ReactElement } from 'react';

import useThree from './useThree';

type StartProps = unknown;
const start: FC<StartProps> = (): ReactElement => {
  const { dom } = useThree();

  return (
    <div
      ref={dom}
      style={{
        height: `calc(100vh - 30px)`,
      }}
    ></div>
  );
};

export default start;
