const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const { promisify } = require('util');

const CommonUtil = require('./commonutil');

class FileUtil {

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
            await promisify(fs.stat)(path);
            return true
        } catch (err) {
            if (err.code === 'ENOENT') return false
        }
    }

    static async fileStat(path) {
        try {
            const st = await promisify(fs.stat)(path);
            return st;
        } catch (err) {
            return null;
        }
    }

    static isDirSync(path) {
        return FileUtil.isExistFileSync(path) && fs.statSync(path).isDirectory();
    }

    static async isDir(path) {
        const st = await FileUtil.fileStat(path);
        return (st) ? st.isDirectory() : false;
    }

    static isFileSync(path) {
        return FileUtil.isExistFileSync(path) && fs.statSync(path).isFile();
    }

    static async isFile(path) {
        const st = await FileUtil.fileStat(path);
        return (st) ? st.isFile() : false;
    }

    static async getFilterFilenameList(parentDirPath, filterFnc) {
        if (!(await FileUtil.isDir(parentDirPath))) {
            throw new Error(`${parentDirPath} is not directory`);
        }
        try {
            const files = await promisify(fs.readdir)(parentDirPath);
            return files.filter((file) => { return filterFnc(path.join(parentDirPath, file)); })
        } catch (err) {
            throw err;
        }
    }

    static getFilterFilenameListSync(parentDirPath, filterFnc) {
        if (!(FileUtil.isDirSync(parentDirPath))) {
            throw new Error(`${parentDirPath} is not directory`);
        }
        try {
            const files = fs.readdirSync(parentDirPath);
            return files.filter((file) => { return filterFnc(path.join(parentDirPath, file)); })
        } catch (err) {
            throw err;
        }
    }

    static async getAsyncFilterFilenameList(parentDirPath, asyncfilterFnc) {
        if (!(await FileUtil.isDir(parentDirPath))) {
            throw new Error(`${parentDirPath} is not directory`);
        }
        try {
            const files = await promisify(fs.readdir)(parentDirPath);
            const filepathlist = files.map((file) => { return path.join(parentDirPath, file) });
            const filters = await CommonUtil.concurrentExecAsyncFunc(asyncfilterFnc, filepathlist);
            return files.filter((file, idx) => { return filters[idx]; });
        } catch (err) {
            throw err;
        }
    }

    static async getFileList(parentDirPath) {
        return await FileUtil.getAsyncFilterFilenameList(parentDirPath, FileUtil.isFile);
    }

    static getFileListSync(parentDirPath) {
        return FileUtil.getFilterFilenameListSync(parentDirPath, FileUtil.isFileSync);
    }

    static async getDirList(parentDirPath) {
        return await FileUtil.getAsyncFilterFilenameList(parentDirPath, FileUtil.isDir);
    }

    static getDirListSync(parentDirPath) {
        return FileUtil.getFilterFilenameListSync(parentDirPath, FileUtil.isDirSync);
    }

    static async getFilterFileStatList(parentDirPath, filterFnc) {
        try {
            const files = await FileUtil.getFilterFilenameList(parentDirPath, filterFnc);
            return await CommonUtil.concurrentExecAsyncFunc(async (file) => {
                const st = await FileUtil.fileStat(path.join(parentDirPath, file));
                if (st) st.name = file;
                return st;
            }, files);
        } catch (err) {
            throw err;
        }
    }

    static async getAsyncFilterFileStatList(parentDirPath, asyncfilterFnc) {
        try {
            const files = await FileUtil.getAsyncFilterFilenameList(parentDirPath, asyncfilterFnc);
            return await CommonUtil.concurrentExecAsyncFunc(async (file) => {
                const st = await FileUtil.fileStat(path.join(parentDirPath, file));
                if (st) st.name = file;
                return st;
            }, files);
        } catch (err) {
            throw err;
        }
    }

    static async getFileStatList(parentDirPath) {
        return await FileUtil.getAsyncFilterFileStatList(parentDirPath, FileUtil.isFile);
    }

    static async getDirStatList(parentDirPath) {
        return await FileUtil.getAsyncFilterFileStatList(parentDirPath, FileUtil.isDir);
    }

    static async readFile(filepath, encoding) {
        const _encoding = encoding || 'utf-8';
        return (await FileUtil.isFile(filepath)) ?
            await promisify(fs.readFile)(filepath, { encoding: _encoding }) : null;
    }

    static async writeFile(filepath, data, encoding) {
        const _encoding = encoding || 'utf-8';
        const writeData = (CommonUtil.is('String', data)) ? data : JSON.stringify(data);
        await promisify(fs.writeFile)(filepath, writeData, { encoding: _encoding });
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
}

module.exports = FileUtil