import { Link, useRouteError } from 'react-router-dom';
interface Err {
  status: number;
  statusText: string;
  internal: boolean;
  data: string;
  error: Error;
  message: string;
  stack: string;
}

export default function ErrorPage() {
  const error = useRouteError() as Err;
  console.dir(error);
  return (
    <div id="error-page">
      <h1>
        页面错误 {error.status} {error.statusText}
      </h1>
      <p>页面发生错误.</p>
      <p style={{ color: 'red' }}>
        <i>{error.message}</i>
      </p>
      <p
        style={{
          whiteSpace: 'pre-line',
        }}
      >
        <i>{error.stack}</i>
      </p>
      <div>
        <button>
          <Link to={'/'} replace>
            返回
          </Link>
        </button>
      </div>
    </div>
  );
}
