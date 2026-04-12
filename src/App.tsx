import { Toaster } from 'react-hot-toast';
import { Fragment } from 'react/jsx-runtime';
import { Home } from './pages/Home';

export default function App() {
  return (
    <Fragment>
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: {
            iconTheme: {
              primary: 'var(--color-purple)',
              secondary: 'white',
            },
          },
        }}
      />
      <Home />
    </Fragment>
  );
}
