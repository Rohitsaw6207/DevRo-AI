import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Coding from './pages/Coding';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/coding',
    element: <Coding />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
]);