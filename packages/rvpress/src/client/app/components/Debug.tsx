import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useData } from '../data';
import cls from './debug.module.scss';

const Debug = import.meta.env.PROD
    ? () => null
    : () => {
          const [open, setOpen] = useState(false);
          const data = useData();
          const elRef = useRef<HTMLDivElement>(null);
          useEffect(() => {
              if (elRef.current) elRef.current.scrollTop = 0;
          }, [open]);
          const toggle = useCallback(() => setOpen(open => !open), []);

          return (
              <div className={cls.debug + ' debug' + (open ? ' open' : ' ')} ref={elRef} onClick={toggle}>
                  <p className="title">Debug</p>
                  <pre className="block">{JSON.stringify(data, null, 4)}</pre>
              </div>
          );
      };

export default React.memo(Debug);
