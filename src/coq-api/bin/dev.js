#!/usr/bin/env node
'use strict';
import {main} from "../server";

require('@njmaeff/run')('../server', '@njmaeff/register/register-dbg')
    .main()
    .then(({run}) => run())
    .catch((e) => {
        console.error(e);
        process.exit(1)
    });
