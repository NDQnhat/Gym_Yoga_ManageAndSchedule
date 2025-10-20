import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import '@ant-design/v5-patch-for-react-19';
import { Provider } from 'react-redux';
import { myStore } from './stores/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={myStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
