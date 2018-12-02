# Orpheos

## How to use

### WINDOWS
In the docker-compose file remove the volumes mapping since shared volumes don't work properly on windows.
It wont allow the database to write files. Not specifying a shared volume, will cause it to create it's own volume where it will have write rights.

### Mysql
To connect to the mysql image use the following command after all services have been started.
``` shell
docker exec -it orpheos_mysql-database_1 bash
```
Once connected to the image run the following command.
```shell
mysql -uroot -p
```
Once you are asked a password use the password that is set in the `./env/.env-mysql`

## License MIT
Copyright 2018 Dries Meerman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.