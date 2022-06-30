import './styles/vars.css';
import './styles/layout.css';
import './styles/code.css';
import './styles/custom-blocks.css';
import './styles/sidebar-links.css';

import { Theme } from 'rvpress';
import Layout from './Layout';
import NotFound from './NotFound';

export { DefaultTheme } from './config';
const theme: Theme = {
    Layout,
    NotFound
};

export default theme;
