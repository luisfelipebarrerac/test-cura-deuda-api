# SEPOMEX api

This is an APIs in nodejs 14.8.0

- use mysql 5.7.28, and server use mysql Ver 14.14 Distrib 5.7.18
- has md5 hashing of passwords
- has token based authentication
- the API is documented with apiDoc.

## Requirements

- First install mysql and node.js required versions.
- Change directory to the proyect then:
- Install all npm packages, run in console `npm install`.
- Run `npm run format` to create a dummy config.

## Config

- Before run, you need to set a config.js file:

* Fill express section with your own port and end point.
* Fill mysql information for database, the recomendation its use host:"localhost" and your root user and password.

## Download SEPOMEX data

- Run `npm run download:excel` to download the data of SEPOMEX

## Fill Database

- First run `npm run db:master` to initial database.
- Run `npm run import:excel` to transfer the data of the file CPdescarga.xls to the database.

## Commands

- To restart the database, please run in console `npm run db:master`.
- To run the API, please write `npm start`.
