# node-update-bmc-tool


> Update BMC Firmware for Data Center


## Install

Install dependencies.

```bash
$ npm install
```

## Run

```bash
$ npm start
```

## Lint

```bash
$ npm run lint
```

## Pack

This project uses the evaluation version of [EncloseJS](http://enclosejs.com/) to compile  Node.js into an executable.

x86 architecture

```bash
$ npm run pack32
```

x64 architecture

```bash
$ npm run pack64
```

## Usage

```
$ cUpdateBmcTool [options]
```


### options


- `-c`: Select a configuration file. Without this, program will use *ipList.xlsx* as default
- `-u`: Select an account. Without this, program will use *admin* as default
- `-p`: Select a password. Without this, program will use *admin* as default

Example 1: Use default configuration file, account and password
```
$ cUpdateBmcTool
```

Example 2: Get IPs from `myConf.xlsx`
```
$ cUpdateBmcTool -c myConf.xlsx
```

Example 3: Get IPs from `myConf.xlsx` and use Account:`myName` and Password:`myPwd` to update
```
$ cUpdateBmcTool -c myConf.xlsx -u myName -p myPwd
```


## Inside the Source

After launching the program, it will scan the row 1 of every sheet and search for the keyword **IP**. Once find out the cell with that keyword, the program will get the IP addresses at the same column.

Find this line and modify its value if you want to use another keyword

```
const SearchKeyword = 'IP';
```

After fetching all IPs from configuration file, the program will fire the command as below to start upgrading the firmware.

Find the line and modify it if you want to use another path, program name, or image name.

```
childProcess.execSync(`./Yafuflash -nw -ip ${ipAddr} -u ${username} -p ${password} rom.ima`,
```

## Maintainers

- [Nimo Hsieh](https://github.com/nimo1491)


## License

Please consult the attached LICENSE file for details.  All rights not explicitly
granted by the Apache 2.0 license are reserved by the Original Author.

It is the opinion of the Original Author that this code conforms to the terms of
the Microsoft Open Specifications Promise, falling under the same terms as
OpenOffice (which is governed by the Apache License v2).  Given the vagaries of
the promise, the Original Author makes no legal claim that in fact end users are
protected from future actions.  It is highly recommended that, for commercial
uses, you consult a lawyer before proceeding.
