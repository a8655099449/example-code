import { MutableRefObject, useEffect, useState } from 'react';

const useBoxSize = (dom: MutableRefObject<HTMLDivElement>, cb?: () => void) => {
  const [value, setValue] = useState({
    width: 0,
    hight: 0,
  });
  const onChange = () => {
    const { clientHeight, clientWidth } = dom.current || {};
    setValue({ width: clientWidth, hight: clientHeight });
    cb?.();
  };

  useEffect(() => {
    if (!dom.current) {
      return;
    }
    const ro = new ResizeObserver(() => onChange());
    ro.observe(dom.current);
    return () => dom.current && ro.unobserve(dom.current);
  }, []);

  return value;
};

export default useBoxSize;
