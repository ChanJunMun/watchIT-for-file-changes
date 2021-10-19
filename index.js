#!/usr/bin/env node

const fs = require('fs');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal');
const { spawn } = require('child_process');
const chalk = require('chalk');

program
    .version('1.0.0')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        } catch (err) {
            throw new Error(`Could not find the file - ${name}`);
        }

        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log(chalk.bold("Starting process......"));
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 100);
        
        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);

