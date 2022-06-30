import React from 'react';

import { Route, Router } from './router';

const Context = React.createContext<{ router?: Router; route?: Route }>({});

export default Context;
