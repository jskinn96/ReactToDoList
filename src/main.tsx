import ReactDOM from 'react-dom/client';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { DarkMode, LightMode } from './styles/theme';
import App from './App';
import Reset from './styles/resetCSS';
import { ThemeAtom } from './recoil';

const ThemedEl = () => { 
  
  const ThemeMode = useRecoilValue(ThemeAtom) === "dark" 
                  ? DarkMode
                  : LightMode;

  return (
    <ThemeProvider theme={ThemeMode}>
      <Reset />
      <App />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <RecoilRoot>
      <ThemedEl />
    </RecoilRoot>
  </>
);