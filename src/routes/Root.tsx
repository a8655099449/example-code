import { Form, NavLink, Outlet, useNavigation } from 'react-router-dom';

export default function Root() {
  const { state } = useNavigation();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <NavLink to={'/three/start'}>
            three.js 正方快
            <span>★</span>
          </NavLink>
        </nav>
      </div>
      <div id="detail" className={state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  );
}
