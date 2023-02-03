import loadable from '@loadable/component';

function load(fn: any, options: any) {
  const Component = loadable(fn, options);
  Component.preload = fn?.requireAsync || fn;
  return Component;
}

function LoadingComponent(props: {
  error: boolean;
  timedOut: boolean;
  pastDelay: boolean;
}) {
  if (props.error) {
    return null;
  }
  return <div>loading</div>;
}

const lazyLoad = (loader: any) => {
  return load(loader, {
    fallback: LoadingComponent({
      pastDelay: true,
      error: false,
      timedOut: false,
    }),
  });
};

export default lazyLoad;
