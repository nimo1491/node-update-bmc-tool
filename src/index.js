import chalk from 'chalk';
import yargs from 'yargs';
import ip from 'ip';
import xlsx from 'xlsx';
import childProcess from 'child_process';

/*
 * Used to find the IP list
 */
const SearchKeyword = 'IP';

/*
 * Used to store IP list
 */
const IpList = [];

// yargs: make options
const options = yargs
  .usage('Usage: $0 [options]')
  .option('c', {
    alias: 'config',
    describe: 'Select a configuration file',
    type: 'string',
    nargs: 1,
    default: 'ipList.xlsx'
  })
  .option('u', {
    alias: 'user',
    describe: 'User name',
    type: 'string',
    nargs: 1,
    default: 'admin'
  })
  .option('p', {
    alias: 'password',
    describe: 'Password',
    type: 'string',
    nargs: 1,
    default: 'admin'
  })
  .help('h')
  .alias('h', 'help')
  .example('$0', 'Get IPs from the default config file and update immediately')
  .example('$0 -f myIpList.xlsx', 'Read IPs from myIpList.xlsx and the update the BMC FW')
  .example('$0 -u haha -p yaya', 'Use haha/yaya as username/password to update the BMC FW')
  .epilog('Copyright 2016 Compal')
  .argv;

function go() {
  let workbook;

  if (options.c) {
    workbook = xlsx.readFile(`${__dirname}/${options.c}`);
  } else {
    workbook = xlsx.readFile(`${__dirname}/${options.c.default}`);
  }

  const sheetNames = workbook.SheetNames;

  // Get IPs from the configuration file
  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const cellKeys = Object.keys(worksheet);
    let ipListColumn;

    // Find out which column list the IPs
    cellKeys
      .filter(k => k[0] !== '!')
      .forEach(k => {
        const col = k.substring(0, 1);
        const row = parseInt(k.substring(1), 10);
        const value = worksheet[k].v;

        if (row === 1 && value === SearchKeyword) {
          ipListColumn = col;
        }
      });

    // Get IPs
    cellKeys
      .filter(k => k[0] !== '!')
      .forEach(k => {
        const col = k.substring(0, 1);
        const value = worksheet[k].v;

        if (col === ipListColumn && value !== SearchKeyword) {
          if (ip.isV4Format(value)) {
            IpList.push(value);
          }
        }
      });
  }

  // Now start updating the BMC
  console.log(chalk.green(`Start updating <===> ${new Date()}`));
  update();
}

function update() {
  let username;
  let password;

  // Get username and password
  if (options.u) {
    username = options.u;
  } else {
    username = options.u.default;
  }
  if (options.p) {
    password = options.p;
  } else {
    password = options.p.default;
  }

  for (const ipAddr of IpList) {
    console.log(chalk.cyan(new Date()));
    childProcess.execSync(`echo ${ipAddr} ${username} ${password}`, { stdio: [0, 1, 2] });
  }
}

// Entry function
go();

