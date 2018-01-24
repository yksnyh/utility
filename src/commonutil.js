const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const prominence = require('prominence');

class CommonUtil {

    static getObjectType(obj) {
        if (obj === undefined) return 'undefined';
        if (obj === null) return 'null';
        const cls = Object.prototype.toString.call(obj).slice(8, -1);
        return cls;
    }

    static getNumberType(number) {
        if (CommonUtil.getObjectType(number) !== 'Number') {
            return null;
        } else if (isFinite(number)) {
            return (Math.floor(number) === number) ? 'Integer' : 'Float';
        } else {
            return 'InfiniteNumber'
        }
    }

    /**
     * @param {string} type - object type
     * @param {Object} obj - target object
     * @returns {boolean} true if type of obj is given type
    */
    static is(type, obj) {
        return CommonUtil.getObjectType(obj) === type;
    }

    static isExistFileSync(path) {
        try {
            fs.statSync(path);
            return true
        } catch (err) {
            if (err.code === 'ENOENT') return false
        }
    }

    static async isExistFile(path) {
        try {
            await prominence(fs, 'stat', [path]);
            return true
        } catch (err) {
            if (err.code === 'ENOENT') return false
        }
    }

    static async fileStat(path) {
        try {
            const st = await prominence(fs, 'stat', [path]);
            return st;
        } catch (err) {
            return null;
        }
    }

    static isDirSync(path) {
        return CommonUtil.isExistFileSync(path) && fs.statSync(path).isDirectory();
    }

    static async isDir(path) {
        const st = await CommonUtil.fileStat(path);
        return (st) ? st.isDirectory() : false;
    }

    static isFileSync(path) {
        return CommonUtil.isExistFileSync(path) && fs.statSync(path).isFile();
    }

    static async isFile(path) {
        const st = await CommonUtil.fileStat(path);
        return (st) ? st.isFile() : false;
    }

    static async getFilterFilenameList(parentDirPath, filterFnc) {
        if (!(await CommonUtil.isDir(parentDirPath))) {
            throw new Error(`${parentDirPath} is not directory`);
        }
        try {
            const files = await prominence(fs, 'readdir', [parentDirPath]);
            return files.filter((file) => { return filterFnc(path.join(parentDirPath, file)); })
        } catch (err) {
            throw err;
        }
    }

    static async getAsyncFilterFilenameList(parentDirPath, asyncfilterFnc) {
        if (!(await CommonUtil.isDir(parentDirPath))) {
            throw new Error(`${parentDirPath} is not directory`);
        }
        try {
            const files = await prominence(fs, 'readdir', [parentDirPath]);
            const filepathlist = files.map((file) => { return path.join(parentDirPath, file) });
            const filters = await CommonUtil.concurrentExecAsyncFunc(asyncfilterFnc, filepathlist);
            return files.filter((file, idx) => { return filters[idx]; });
        } catch (err) {
            throw err;
        }
    }

    static async getFileList(parentDirPath) {
        return await CommonUtil.getAsyncFilterFilenameList(parentDirPath, CommonUtil.isFile);
    }

    static async getDirList(parentDirPath) {
        return await CommonUtil.getAsyncFilterFilenameList(parentDirPath, CommonUtil.isDir);
    }

    static async getFilterFileStatList(parentDirPath, filterFnc) {
        try {
            const files = await CommonUtil.getFilterFilenameList(parentDirPath, filterFnc);
            return await CommonUtil.concurrentExecAsyncFunc(async (file) => {
                const st = await CommonUtil.fileStat(path.join(parentDirPath, file));
                if (st) st.name = file;
                return st;
            }, files);
        } catch (err) {
            throw err;
        }
    }

    static async getAsyncFilterFileStatList(parentDirPath, asyncfilterFnc) {
        try {
            const files = await CommonUtil.getAsyncFilterFilenameList(parentDirPath, asyncfilterFnc);
            return await CommonUtil.concurrentExecAsyncFunc(async (file) => {
                const st = await CommonUtil.fileStat(path.join(parentDirPath, file));
                if (st) st.name = file;
                return st;
            }, files);
        } catch (err) {
            throw err;
        }
    }

    static async getFileStatList(parentDirPath) {
        return await CommonUtil.getAsyncFilterFileStatList(parentDirPath, CommonUtil.isFile);
    }

    static async getDirStatList(parentDirPath) {
        return await CommonUtil.getAsyncFilterFileStatList(parentDirPath, CommonUtil.isDir);
    }

    static async readFile(filepath, encoding) {
        const _encoding = encoding || 'utf-8';
        return (await CommonUtil.isFile(filepath)) ?
            await prominence(fs, 'readFile', [filepath, { encoding: _encoding }]) : null;
    }

    static readlines(filepath, encode) {
        return new Promise((resolve, reject) => {
            const enc = encode || 'utf-8';
            fs.readFile(filepath, enc, (err, data) => {
                if (err) reject(err);
                else {
                    resolve(data.split('\n'));
                }
            })
        });
    }

    static getBasePath() {
        let dir = __dirname;
        return dir.substring(0, dir.lastIndexOf('\\'));
    }

    static replaceAll(expression, org, dest) {
        return expression.split(org).join(dest);
    }

    static escape_xml(string) {
        if (typeof string !== 'string') {
            return string;
        }
        return string.replace(/[&'`"<>]/g, function (match) {
            return {
                '&': '&amp;',
                "'": '&#x27;',
                '`': '&#x60;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
            }[match]
        });
    }

    static escape_xml_lite(string) {
        return CommonUtil.replaceAll(CommonUtil.replaceAll(string, '<', '&lt;'), '>', '&gt;');
    }

    static unescape_xml_lite(string) {
        return CommonUtil.replaceAll(CommonUtil.replaceAll(string, '&lt;', '<'), '&gt;', '>');
    }

    static md5sum(str) {
        let md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    }

    static formatDate(date, format) {
        if (!format) {
            format = 'YYYY/MM/DD hh:mm:ss:SSS';
        }
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        if (format.match(/S/g)) {
            var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
            var length = format.match(/S/g).length;
            for (var i = 0; i < length; i++)
                format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
    }

    static toLowerKey(obj) {
        let retObj = {};
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                retObj[prop.toLowerCase()] = obj[prop];
            } else {
                retObj[prop] = obj[prop];
            }
        }
        return retObj;
    }

    static getLocalAddress() {
        let ifacesObj = {}
        ifacesObj.ipv4 = [];
        ifacesObj.ipv6 = [];
        const interfaces = os.networkInterfaces();

        for (let dev in interfaces) {
            interfaces[dev].forEach(function (details) {
                if (!details.internal) {
                    switch (details.family) {
                        case "IPv4":
                            ifacesObj.ipv4.push({ name: dev, address: details.address });
                            break;
                        case "IPv6":
                            ifacesObj.ipv6.push({ name: dev, address: details.address })
                            break;
                        default:
                            // do nothing
                            break;
                    }
                }
            });
        }
        return ifacesObj;
    }

    static getRequestMimeType(request) {
        let type = null;
        if ('headers' in request) {
            type = ('content-type' in request.headers) ? request.headers['content-type'].toString() : null;
            if (!type)
                type = ('Content-Type' in request.headers) ? request.headers['Content-Type'].toString() : null;
            if (type)
                type = type.split(';')[0];
        }
        return type;
    }

    static getResponseMimeType(response) {
        let type = null;
        if ('headers' in response) {
            type = ('content-type' in response.headers) ? response.headers['content-type'].toString() : null;
            if (!type)
                type = ('Content-Type' in response.headers) ? response.headers['Content-Type'].toString() : null;
            if (type)
                type = type.split(';')[0];
        }
        return type;
    }

    static urljoin() {
        const args = Array.prototype.slice.call(arguments);
        for (let i = 0, len = args.length; i < len; i++) {
            let s = (CommonUtil.is('String', args[i])) ? args[i].trim() : args[i].toString().trim();
            if (i > 0 && s.slice(0, 1) === '/') s = s.slice(1);
            if (i < len - 1 && s.slice(-1) === '/') s = s.slice(0, -1);
            args[i] = s;
        }
        return args.join('/');
    }

    static concurrentExecAsyncFuncList(asyncFuncList) {
        return new Promise((resolve, reject) => {
            Promise.all(asyncFuncList).then(function (values) {
                return resolve(values);
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    static async concurrentExecAsyncFunc(asyncFunc, arglist) {
        const asyncFuncList = [];
        arglist.forEach((arg) => {
            asyncFuncList.push(asyncFunc(arg))
        });
        return await CommonUtil.concurrentExecAsyncFuncList(asyncFuncList);
    }

    static sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec))
    }

}

module.exports = CommonUtil