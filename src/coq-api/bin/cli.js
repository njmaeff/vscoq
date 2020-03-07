#!/usr/bin/env node
'use strict';
require('@njmaeff/run')('../', '@njmaeff/register/register-dbg')
    .main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
